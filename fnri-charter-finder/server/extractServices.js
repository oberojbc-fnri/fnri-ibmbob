// server/extractServices.js
// Calls watsonx.ai with a prompt engineered for the ARTA RA 11032 Citizen Charter format.
// Returns a structured JSON array matching the services.json schema.

const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

/**
 * @param {string} pdfText  Plain text extracted from the Citizen Charter PDF
 * @returns {Promise<Object[]>}  Array of service objects matching services.json schema
 */
async function extractServices(pdfText) {
  const client = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
  });

  // Truncate to stay within token limits — take first 12000 chars (covers most charters)
  const truncated = pdfText.length > 12000 ? pdfText.slice(0, 12000) + '\n[...truncated]' : pdfText;

  const prompt = `You are a Philippine government data extraction expert. Below is plain text from a Citizen Charter PDF following the ARTA RA 11032 format.

Extract EVERY service listed in the charter. Each service in an ARTA Citizen Charter has these columns:
- Service/Transaction name
- Client steps
- Agency action  
- Fees (if any)
- Processing time
- Person responsible / Office

Return a valid JSON array. Each element must have exactly these fields:
{
  "plainName": "<short citizen-friendly name>",
  "officialName": "<full official service name from charter>",
  "description": "<one sentence plain-language description of what this service does>",
  "category": "<one of: laboratory | training | consultancy | data | library | information | regulatory | other>",
  "office": "<division or office name>",
  "whoMayAvail": "<who can use this service>",
  "requirements": ["<requirement 1>", "<requirement 2>"],
  "processingTime": "<plain language, e.g. '5-10 working days'>",
  "fees": "<'Free' or fee amount, e.g. 'PHP 1,500' or 'Varies by parameter — see schedule'>",
  "tags": ["<keyword1>", "<keyword2>"]
}

Rules:
- Use plain English in plainName and description — avoid government jargon
- Replace "15 WD" with "15 working days", "duly accomplished form" with "filled-out form"
- If fees are tiered (multiple rates), summarize as "Varies by [parameter] — see fee schedule"
- Assign 3–6 tags that a citizen would use to search for this service
- Do NOT include commentary, markdown, or any text outside the JSON array
- Output ONLY the raw JSON array starting with [ and ending with ]

CHARTER TEXT:
${truncated}

JSON:`;

  const response = await client.generateText({
    modelId: process.env.WATSONX_MODEL_ID || 'meta-llama/llama-3-1-70b-instruct',
    projectId: process.env.WATSONX_PROJECT_ID,
    input: prompt,
    parameters: {
      max_new_tokens: 4096,
      temperature: 0.1,
      top_p: 0.9,
      repetition_penalty: 1.1,
    },
  });

  const rawText = response.result?.results?.[0]?.generated_text?.trim() ?? '';

  // Extract the JSON array from the response (model may include extra text)
  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('watsonx.ai did not return a valid JSON array. Raw response: ' + rawText.slice(0, 500));
  }

  let services;
  try {
    services = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Failed to parse JSON from watsonx.ai response: ' + e.message);
  }

  if (!Array.isArray(services)) {
    throw new Error('Parsed result is not an array');
  }

  return services;
}

module.exports = { extractServices };
