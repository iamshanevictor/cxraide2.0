# Architecture

Status: assessed from the repository on 2026-10-27. **Observed** means present in code or documentation; the target direction was approved on 2026-10-27 but is not implemented or deployed.

## Observed current system

```text
Browser: Vue 3 / Vite SPA
  public landing, research, metrics, about, demo
  legacy login, home, annotate, upload routes
  local drawing; CSV/PDF/PNG exports; localStorage token and demo image
       | HTTP, VITE_API_BASE_URL
Flask server/app.py
  /login, /check-session, /health, /admin/reset-password
  /api/predict, /api/model-status, /api/loading-status via model_service.py
       | local image processing, mock model or optional Torch/torchvision
Local model weights: server/models/*.pth, absent from this checkout

Database: none active       Durable jobs: none found
Deployment: client/vercel.json SPA rewrite; README proposes client/ on Vercel
Backend production host: not established in this repository
```

The Flask model loader uses a process-local background thread, not a durable queue. Local setup scripts install dependencies and default to mock models and development login. A separate [model-training repository](https://github.com/iamshanevictor/CXRaide2.0-Model_Training) contains preparation and training notebooks. The exact mapping between this application's displayed metrics, local weights and experiment runs remains unverified.

Important source files: `client/src/router/index.js` (page map and browser guard); `client/src/views/DemoWorkspaceView.vue` (public sample, drawing, exports); `client/src/views/AnnotateView.vue` and `UploadCXRView.vue` (older protected workflows); `client/src/services/modelService.js` (image preparation and prediction HTTP contract); `server/app.py` (Flask application and development login); `server/model_service.py` (mock/real model loading and inference); `client/package.json`, `server/requirements*.txt`, `client/vite.config.js`, and `client/vercel.json` (build and deployment assumptions).

Observed risks: development login accepts a username without verifying a password; browser route guard accepts an unsigned offline token; inference has no verified user boundary; browser demo saves the last image in localStorage; report construction inserts user fields into HTML; model-mode selection and mock-without-Torch behavior need tests. These are code findings, not a claim that a hosted instance was tested.

The demo's current `Load sample` action constructs a synthetic 512×512 gradient/noise image in canvas (`DemoWorkspaceView.vue`), rather than loading a real sample chest X-ray. This differs from the owner's desired showcase and needs a source/permission decision before an asset is added.

The source-backed public demo behavior, API boundary, coordinates, exports, simulation modes, and privacy findings are recorded in [the CX-001 demo contract](DEMO_CONTRACT.md). That note is discovery evidence, not an approved implementation design.

No automated test suite, CI workflow, schema, or migrations were found. Python syntax parsing passed for the two server source files. Builds, lint, runtime inference, model accuracy, hosted operation, and provider accounts were not verified because dependencies and model files were absent and this bootstrap did not install them.

## Approved target direction, implementation pending

```text
Public Vite SPA on a suitable free static host, potentially Vercel
  -> approved sample images with verified permission/provenance
  -> manual annotation and explicitly simulated, non-clinical results
  -> local export; no visitor upload or automatic browser image retention
  -> no identifiable image/report persistence

Local developer/research mode
  -> Python inference with downloaded, trusted weights
  -> reproducible comparison against the separate research repository

Optional later, only if a real account/data requirement is approved
  -> Supabase Auth + Postgres + private Storage with verified ownership/RLS
  -> short Edge Functions for suitable integration/orchestration
  -> Python service remains responsible for PyTorch inference
```

For the **current** public showcase, evaluate a static browser simulation first; adoption depends on contract, privacy and parity validation. Browser simulation must remain clearly labeled. If a hosted mock API is retained, its output contract, resource limits, CORS, abuse controls, and availability require validation. Do not introduce Supabase solely to satisfy a hypothetical future account system.

Vercel documents Vite support, but Hobby is for personal, non-commercial use; actual eligibility must be checked by the owner. Supabase Free currently has capacity limits and pauses after inactivity, so it is not a default prerequisite for this demo. Supabase Edge Functions use a Deno-compatible runtime with limited memory/CPU, unlike this Python/PyTorch model. Pricing and limits can change; recheck at a hosting decision. Sources: [Vercel Vite](https://vercel.com/docs/frameworks/frontend/vite), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase pricing](https://supabase.com/pricing), [Edge runtime](https://supabase.com/docs/guides/functions), [Edge limits](https://supabase.com/docs/guides/functions/limits).

If persistence is later approved, use server-verified identity, explicit Postgres constraints/transactions, per-operation grants and RLS, private Storage policies, isolated dry runs, separate database/object backups, ownership and integrity checks, parity tests, rollback, and an owner-controlled cutover. No current data source exists to migrate. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [backup limitations](https://supabase.com/docs/guides/platform/backups) inform that future design.

## Component options and gates

| Area | Retain/refactor | Migrate/replace | Current recommendation and gate |
|---|---|---|---|
| Vue/Vite | Keep current routes and characterize annotation/export behavior; simplify overlapping screens only after use is confirmed. Lower change risk. | Full UI rewrite would require broad interaction and report parity work without a known need. | Retain. Reconsider if focused changes repeatedly cross all three workspace screens. |
| Demo predictions | Keep clearly marked simulation and validate whether browser-only execution meets the public contract. | Hosted mock API adds operating cost/abuse surface; real hosted inference adds large-model runtime cost. | Compare browser and hosted paths by output parity, latency, cost, and privacy before choosing. |
| Python real inference | Retain for local research use and verify with trusted weights. | A new runtime would need model and numeric parity evidence. | Retain. Measure accuracy parity, startup, memory, and latency before any host migration. |
| Identity/data | Keep public demo without accounts or a database. | Supabase Auth/Postgres/Storage would add account and retention obligations without an approved current use. | Defer. Reopen only for an approved persistent radiologist workflow with authorization tests. |

## Phased direction

0. Confirm the demo contract and approved public-upload/privacy policy; validate sample-image rights and the exact research evidence for displayed metrics.
1. Capture current behavior in focused synthetic-data characterization tests and establish a runnable local baseline.
2. In small slices, make the approved public demo reliable and clearly simulated; validate exports, labels, and image handling.
3. Evaluate a free static host versus a hosted mock API with measured resource and privacy needs; perform owner-controlled release gates.
4. Consider accounts and persistence only if the owner approves a new requirement. Do not prebuild a migration for absent authoritative data.
