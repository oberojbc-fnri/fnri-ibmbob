// server/normalizeServices.js
// Post-processes raw services extracted by watsonx.ai:
//  - Assigns sequential id fields
//  - Normalises processing time strings
//  - Cleans fee strings
//  - Ensures required fields are present with sensible defaults
//  - Validates category values

const VALID_CATEGORIES = new Set([
  'laboratory', 'training', 'consultancy', 'data', 'library',
  'information', 'regulatory', 'other',
]);

const TIME_PATTERNS = [
  [/\b(\d+)\s*WD\b/gi,            '$1 working days'],
  [/\bworking day\b/gi,            'working days'],
  [/\bcalendar days?\b/gi,         'calendar days'],
  [/\bCD\b/g,                      'calendar days'],
  [/\bsame[- ]day\b/gi,            'Same day'],
];

const FEE_FREE_PATTERNS = [/^free$/i, /^none$/i, /^no\s+fee$/i, /^n\/a$/i, /^waived$/i];

function normalizeTime(raw) {
  if (!raw) return 'See charter';
  let s = String(raw).trim();
  for (const [pattern, replacement] of TIME_PATTERNS) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

function normalizeFee(raw) {
  if (!raw) return 'See charter';
  const s = String(raw).trim();
  // Canonical free strings
  if (FEE_FREE_PATTERNS.some(p => p.test(s))) return 'Free';
  // Normalise PHP prefix capitalisation
  const phpNorm = s.replace(/^php\s*/i, 'PHP ');
  return phpNorm;
}

function normalizeCategory(raw) {
  if (!raw) return 'other';
  const lower = String(raw).toLowerCase().trim();
  if (VALID_CATEGORIES.has(lower)) return lower;
  // Fuzzy fallback
  if (lower.includes('lab') || lower.includes('test') || lower.includes('analy')) return 'laboratory';
  if (lower.includes('train') || lower.includes('seminar') || lower.includes('workshop')) return 'training';
  if (lower.includes('consult') || lower.includes('advis') || lower.includes('assist')) return 'consultancy';
  if (lower.includes('data') || lower.includes('survey') || lower.includes('research')) return 'data';
  if (lower.includes('librar') || lower.includes('publicat')) return 'library';
  if (lower.includes('informat') || lower.includes('scholar')) return 'information';
  if (lower.includes('regulat') || lower.includes('comply') || lower.includes('permit')) return 'regulatory';
  return 'other';
}

/**
 * @param {Object[]} rawServices  Array from extractServices.js
 * @param {string}   agencyId     e.g. 'fnri', 'pnri', 'sei'
 * @returns {Object[]}
 */
function normalizeServices(rawServices, agencyId = 'agency') {
  return rawServices.map((s, i) => {
    const idx = String(i + 1).padStart(3, '0');
    return {
      id:             `${agencyId}-s${idx}`,
      plainName:      s.plainName     || s.officialName || `Service ${idx}`,
      officialName:   s.officialName  || s.plainName    || `Service ${idx}`,
      description:    s.description   || '',
      category:       normalizeCategory(s.category),
      office:         s.office        || '',
      whoMayAvail:    s.whoMayAvail   || 'General public',
      requirements:   Array.isArray(s.requirements) ? s.requirements : [],
      processingTime: normalizeTime(s.processingTime),
      fees:           normalizeFee(s.fees),
      tags:           Array.isArray(s.tags) ? s.tags : [],
    };
  });
}

module.exports = { normalizeServices };
