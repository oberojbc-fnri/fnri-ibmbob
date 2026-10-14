// server/extractServices.js
// Calls a local Ollama instance for PDF text extraction.
// No API key or cloud account required — fully free and offline.
//
// Setup (one-time):
//   1. Install Ollama: https://ollama.com/download
//   2. Pull a model: ollama pull llama3.1   (or mistral, phi3, gemma2)
//   3. Start Ollama: ollama serve           (runs on http://localhost:11434)
//   4. Start this server: npm run server

// Maximum characters per Ollama call.
// llama3.1 8B has a ~8k token context; 8000 chars ≈ 2000 tokens leaving room for output.
// Larger models (llama3.1:70b, mistral-large) can handle CHUNK_SIZE = 20000.
const CHUNK_SIZE = 8000;
const OVERLAP    = 400; // overlap between chunks to avoid splitting a service entry

/**
 * Build the extraction prompt for one text chunk.
 * @param {string}  chunk
 * @param {boolean} isContinuation  true when this is chunk 2+
 */
function buildPrompt(chunk, isContinuation) {
  const intro = isContinuation
    ? `You are a Philippine government data extraction expert continuing to extract services from a Citizen Charter PDF (ARTA RA 11032 format). This is a CONTINUATION — extract only NEW services not seen in earlier chunks.`
    : `You are a Philippine government data extraction expert. Extract EVERY service from the Citizen Charter PDF text below (ARTA RA 11032 format).`;

  return `${intro}

Each ARTA Citizen Charter service has: Service name · Client steps · Agency action · Fees · Processing time · Office.

Return a JSON array. Each element must have exactly these fields:
{
  "plainName": "<short citizen-friendly name, max 8 words>",
  "officialName": "<full official name from charter>",
  "description": "<one plain-English sentence describing what the service does>",
  "category": "<one of: laboratory | training | consultancy | data | library | information | regulatory | other>",
  "office": "<division or office responsible>",
  "whoMayAvail": "<who may use this service>",
  "requirements": ["<item 1>", "<item 2>"],
  "processingTime": "<e.g. '5-10 working days' or 'Same day'>",
  "fees": "<'Free' or 'PHP 1,500' or 'Varies by parameter — see fee schedule'>",
  "tags": ["<3-6 search keywords a citizen would type>"]
}

Rules:
- Plain English only — no government jargon in plainName or description
- "15 WD" → "15 working days" · "duly accomplished form" → "filled-out form"
- Tiered fees → "Varies by [parameter] — see fee schedule"
- Tags: include category + fee type (free/paid) + audience (researcher/industry/public)
- Output ONLY the raw JSON array — no markdown fences, no explanation, nothing outside [ ]
- If no services are found in this chunk, return: []

CHARTER TEXT:
${chunk}

JSON:`;
}

/**
 * Call Ollama's generate API with the given prompt.
 * @param {string} prompt
 * @returns {Promise<Object[]>}
 */
async function callOllama(prompt) {
  const ollamaUrl = process.env.OLLAMA_URL  || 'http://localhost:11434';
  const model     = process.env.OLLAMA_MODEL || 'llama3.1';

  const body = JSON.stringify({
    model,
    prompt,
    stream: false,
    options: {
      temperature:       0.05,  // very low — extraction needs determinism
      top_p:             0.9,
      repeat_penalty:    1.1,
      num_predict:       4096,  // max tokens to generate
    },
  });

  let res;
  try {
    res = await fetch(`${ollamaUrl}/api/generate`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch (e) {
    throw new Error(
      `Cannot reach Ollama at ${ollamaUrl}. ` +
      `Make sure Ollama is running: run "ollama serve" in a terminal. (${e.message})`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Ollama returned HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const rawText = (data.response || '').trim();

  // Extract the JSON array — model may add a brief preamble
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn('[extractServices] No JSON array in Ollama response. Raw:', rawText.slice(0, 200));
    return [];
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[extractServices] JSON parse failed:', e.message, '\nRaw:', rawText.slice(0, 200));
    return [];
  }
}

/**
 * Extract all services from a full charter PDF text.
 * Splits into overlapping chunks so large PDFs (PNRI: 52 services) are fully covered.
 *
 * @param {string} pdfText  Plain text from pdf-parse
 * @returns {Promise<Object[]>}
 */
async function extractServices(pdfText) {
  const model = process.env.OLLAMA_MODEL || 'llama3.1';

  // Build chunks with overlap
  const chunks = [];
  for (let start = 0; start < pdfText.length; start += CHUNK_SIZE - OVERLAP) {
    chunks.push(pdfText.slice(start, start + CHUNK_SIZE));
    if (start + CHUNK_SIZE >= pdfText.length) break;
  }

  console.log(`[extractServices] model=${model}  chunks=${chunks.length}  textLen=${pdfText.length}`);

  const allServices = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`[extractServices] chunk ${i + 1}/${chunks.length} …`);
    const prompt   = buildPrompt(chunks[i], i > 0);
    const services = await callOllama(prompt);
    console.log(`[extractServices] chunk ${i + 1}: ${services.length} service(s) extracted`);
    allServices.push(...services);
  }

  // Deduplicate by officialName (overlap can produce duplicate entries)
  const seen   = new Set();
  const unique = allServices.filter(s => {
    const key = (s.officialName || s.plainName || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`[extractServices] done — ${allServices.length} total, ${unique.length} after dedup`);
  return unique;
}

module.exports = { extractServices };
