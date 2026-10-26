# CXRaide 2.0

CXRaide is currently a public **research demo**, not a clinical service. Hosted results are simulated; the separately downloaded real models run locally. Do not use identifiable patient images or reports for the public showcase. The radiologist sign-in is a future concept, and the present development login is not production identity.

For the current scope and modernization work, start with [requirements](REQUIREMENTS.md), [architecture](docs/architecture/ARCHITECTURE.md), [decisions](docs/architecture/DECISIONS.md), and the [active task queue](PROJECT_TASKS.md). Setup instructions below describe the existing local application.

Automatic Chest X-Ray Pattern Annotation and Classification.

CXRaide 2.0 is a local-first research application with a Vue/Vite frontend and a Flask backend. The backend provides local JWT-style development login and chest X-ray model inference endpoints. Database integration is intentionally disabled for now and will be redesigned later.

## Project Structure

```text
client/   Vue 3 + Vite frontend
server/   Flask backend and model inference service
```

## Local Development

### Backend

```powershell
.\run_backend.ps1
```

Manual setup:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r server\requirements.txt
$env:PORT="5000"
$env:FRONTEND_URL="http://localhost:5173"
$env:SECRET_KEY="local-dev-secret-change-me"
$env:USE_MOCK_MODELS="true"
$env:ALLOW_DEV_LOGIN="true"
cd server
flask run --host=0.0.0.0 --port=5000 --reload
```

The backend will run at `http://localhost:5000`.

### Frontend

```powershell
.\run_frontend.ps1
```

Manual setup:

```powershell
cd client
npm install
$env:VITE_API_BASE_URL="http://localhost:5000"
npm run dev
```

The frontend will run at `http://localhost:5173`.

## Environment Variables

Frontend (`client/.env`):

```text
VITE_API_BASE_URL=http://localhost:5000
```

Backend (`server/.env` or shell):

```text
PORT=5000
FRONTEND_URL=http://localhost:5173
SECRET_KEY=local-dev-secret-change-me
USE_MOCK_MODELS=true
ALLOW_DEV_LOGIN=true
```

For real local model inference, place model files in `server/models/` and set:

```text
USE_MOCK_MODELS=false
```

Expected model filenames:

```text
server/models/IT2_model_epoch_300.pth
server/models/IT3_model_epoch_260.pth
```

Install real model extras only when needed:

```powershell
pip install -r server\requirements.local.txt
```

## Vercel Frontend Deployment

The frontend is Vercel-ready. Deploy the `client/` folder as the Vercel project.

Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-future-backend-url.com`

The Flask/Python backend includes image processing and optional PyTorch model inference. It should remain a separate backend/model service for now rather than being forced into Vercel serverless functions.

## Database Status

No external database or cloud identity provider is active. Login is a local development placeholder that issues a short-lived JWT when `ALLOW_DEV_LOGIN=true`.

TODO: Database-backed users, access control, image assignments, and annotation persistence will be redesigned later.
