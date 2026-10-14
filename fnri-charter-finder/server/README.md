# FNRI Charter Finder — Backend Server

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your IBM watsonx.ai credentials:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `WATSONX_API_KEY` — IBM Cloud API key with watsonx.ai access
   - `WATSONX_PROJECT_ID` — watsonx.ai project ID
   - `WATSONX_URL` — Regional endpoint, e.g. `https://us-south.ml.cloud.ibm.com`

3. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/extract` | Upload PDF → watsonx.ai → returns `services[]` JSON |
| `POST` | `/api/publish` | Save approved services.json to Angular data directory |
| `GET`  | `/api/agencies` | List all onboarded agencies with service counts |

## `/api/extract` — Request

```
Content-Type: multipart/form-data
Fields:
  file      (PDF, required, max 20MB)
  agencyId  (string, e.g. "pnri")
```

## `/api/extract` — Response

```json
{
  "services": [...],
  "pageCount": 42,
  "agencyId": "pnri"
}
```

## Model Selection

Default model: `meta-llama/llama-3-1-70b-instruct`

Override with env variable: `WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2`
