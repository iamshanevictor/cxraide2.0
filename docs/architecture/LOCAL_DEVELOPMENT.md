# Local development startup

Checked: 2026-10-27. This describes the existing Vue/Vite frontend and Flask backend. It is a local developer setup, not a production deployment recipe.

## Before you start

- Windows PowerShell, Node.js/npm, and Python are needed.
- This checkout currently has `client/node_modules` and a repository-root `.venv`; required Flask imports were present when checked. The real-model PyTorch package is absent, which is okay for mock mode.
- No Dockerfile or Compose manifest was found. Docker is not the supported startup path in this repository.
- The root launcher scripts are convenient but have side effects: `run_frontend.ps1` runs `npm install` if `client/node_modules` is absent; `run_backend.ps1` creates `.venv` if missing and runs `pip install -r server/requirements.txt` on every invocation. Use the manual commands below to avoid automatic installs.

## Start the backend

Open a PowerShell terminal at the repository root and run:

```powershell
$env:PORT = "5000"
$env:FRONTEND_URL = "http://127.0.0.1:5173"
$env:SECRET_KEY = "local-development-only"
$env:USE_MOCK_MODELS = "true"
$env:ALLOW_DEV_LOGIN = "true"
Set-Location .\server
..\.venv\Scripts\python.exe -m flask run --host=127.0.0.1 --port=5000 --reload
```

Expected address: `http://127.0.0.1:5000`. Keep this terminal open. `USE_MOCK_MODELS=true` selects simulated results and does not need model weights. The development login is only for local development; do not expose this server publicly or reuse the local secret elsewhere.

## Start the frontend

Open a second PowerShell terminal at the repository root and run:

```powershell
$env:VITE_API_BASE_URL = "http://127.0.0.1:5000"
Set-Location .\client
npm run dev -- --host 127.0.0.1
```

Expected address: `http://127.0.0.1:5173`. Open that address in your browser. The demo makes prediction and model-status requests to the Flask backend, so keep both terminals running for those features. Stop either process with `Ctrl+C`.

## Real local models

Mock mode is the default recommended startup for this demo. Real inference is a separate local-research setup: the README names `server/models/IT2_model_epoch_300.pth` and `server/models/IT3_model_epoch_260.pth`, and requires the optional PyTorch requirements plus trusted weights. Those weights are not in this checkout. Do not switch `USE_MOCK_MODELS` off until the required weights and compatible libraries are installed locally.

## What was verified here

- `client/node_modules` and `.venv` exist; the installed virtual environment imported Flask, Flask-CORS, Pillow, NumPy, and python-jose.
- The Flask development server started at `127.0.0.1:5000` with mock mode and emitted the expected “PyTorch unavailable, using lightweight mock” messages. The server was stopped afterward.
- This execution environment denied local socket access (`EACCES` for Vite binding and a permission error for an HTTP request to Flask). Therefore frontend startup in a normal desktop shell, browser access, and end-to-end frontend/backend behavior remain unverified. No dependencies were installed and no configuration or data files were changed.
