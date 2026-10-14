// server/index.js
// Express backend for the FNRI Charter Finder PDF extraction pipeline.
// Routes:
//   POST /api/extract  — upload PDF → watsonx.ai → structured services JSON
//   POST /api/publish  — save approved services.json to angular data dir
//   GET  /api/agencies — list all onboarded agencies

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const multer   = require('multer');
const pdfParse = require('pdf-parse');
const path     = require('path');
const fs       = require('fs');

const { extractServices }   = require('./extractServices');
const { normalizeServices } = require('./normalizeServices');

const app  = express();
const port = process.env.PORT || 3000;

// Multer — memory storage so we can pass buffer directly to pdf-parse
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are accepted'));
  },
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ---------------------------------------------------------------------------
// POST /api/extract
// Body: multipart/form-data  with fields:
//   file       — the Citizen Charter PDF
//   agencyId   — slug for the agency (e.g. 'pnri')
// Response: { services: Service[] }
// ---------------------------------------------------------------------------
app.post('/api/extract', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }
  const agencyId = (req.body.agencyId || 'agency').toLowerCase().replace(/[^a-z0-9-]/g, '');

  try {
    // Extract plain text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 100) {
      return res.status(422).json({ error: 'Could not extract readable text from PDF. The file may be scanned/image-based.' });
    }

    // Call watsonx.ai
    const rawServices = await extractServices(pdfText);

    // Normalize
    const services = normalizeServices(rawServices, agencyId);

    res.json({ services, pageCount: pdfData.numpages, agencyId });
  } catch (err) {
    console.error('Extract error:', err);
    res.status(500).json({ error: err.message || 'Extraction failed' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/publish
// Body: JSON { agencyId: string, agencyConfig: object, services: Service[] }
// Writes files to ../src/app/data/agencies/<agencyId>/
// Response: { url: string, serviceCount: number }
// ---------------------------------------------------------------------------
app.post('/api/publish', async (req, res) => {
  const { agencyId, agencyConfig, services } = req.body;
  if (!agencyId || !services || !Array.isArray(services)) {
    return res.status(400).json({ error: 'agencyId and services array are required' });
  }

  const slug = agencyId.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const agencyDir = path.join(__dirname, '..', 'src', 'app', 'data', 'agencies', slug);

  try {
    fs.mkdirSync(agencyDir, { recursive: true });
    fs.writeFileSync(path.join(agencyDir, 'services.json'), JSON.stringify(services, null, 2));
    if (agencyConfig) {
      fs.writeFileSync(path.join(agencyDir, 'agency.config.json'), JSON.stringify({ ...agencyConfig, agencyId: slug }, null, 2));
    }
    console.log(`Published ${services.length} services for agency "${slug}" to ${agencyDir}`);
    res.json({
      success: true,
      agencyId: slug,
      serviceCount: services.length,
      message: `Successfully published ${services.length} services for ${slug}. Rebuild the Angular app to go live.`,
    });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({ error: err.message || 'Publish failed' });
  }
});

// ---------------------------------------------------------------------------
// GET /api/agencies
// Returns list of onboarded agencies from the data directory
// ---------------------------------------------------------------------------
app.get('/api/agencies', (req, res) => {
  const agenciesDir = path.join(__dirname, '..', 'src', 'app', 'data', 'agencies');
  try {
    const dirs = fs.readdirSync(agenciesDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== '__pycache__')
      .map(d => d.name);

    const agencies = dirs.map(dir => {
      const configPath = path.join(agenciesDir, dir, 'agency.config.json');
      const servicesPath = path.join(agenciesDir, dir, 'services.json');
      if (!fs.existsSync(configPath)) return null;
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const services = fs.existsSync(servicesPath)
          ? JSON.parse(fs.readFileSync(servicesPath, 'utf8'))
          : [];
        return { ...config, agencyId: dir, serviceCount: services.length };
      } catch { return null; }
    }).filter(Boolean);

    res.json({ agencies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`FNRI Charter Finder API running on http://localhost:${port}`);
  console.log('  POST /api/extract  — PDF → watsonx.ai → services JSON');
  console.log('  POST /api/publish  — save approved services to Angular data dir');
  console.log('  GET  /api/agencies — list onboarded agencies');
});
