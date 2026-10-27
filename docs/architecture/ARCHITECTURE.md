# Architecture

Status: assessed from the repository on 2026-10-27. **Observed** means present in code or documentation; browser simulation is implemented for `/demo`, while static hosting is not deployed.

## Observed current system

```text
Browser: Vue 3 / Vite SPA
  public landing, research, metrics, about, demo
  legacy login, home, annotate, upload routes
  local drawing; CSV/PDF/PNG exports; localStorage auth token
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

CX-011 changed only the public `/demo` prediction action: it reads fixed findings from `client/src/services/demoSimulation.js` and does not call `/api/predict` or `/api/model-status`. The annotation screen still uses `modelService.js` for colors, and other older workflows retain their prior API behavior. The unauthenticated Flask upload route still exists; no public backend should be exposed based on the UI-only upload restriction.

Important source files: `client/src/router/index.js` (page map and browser guard); `client/src/views/DemoWorkspaceView.vue` (public sample, drawing, exports); `client/src/views/AnnotateView.vue` and `UploadCXRView.vue` (older protected workflows); `client/src/services/modelService.js` (image preparation and prediction HTTP contract); `server/app.py` (Flask application and development login); `server/model_service.py` (mock/real model loading and inference); `client/package.json`, `server/requirements*.txt`, `client/vite.config.js`, and `client/vercel.json` (build and deployment assumptions).

Observed risks: development login accepts a username without verifying a password; browser route guard accepts an unsigned offline token; legacy inference has no verified user boundary; the Flask API still accepts image uploads if directly exposed; legacy report construction inserts user fields into HTML; model-mode selection and mock-without-Torch behavior have characterized defects. CX-004 removed automatic demo image retention and clears its legacy browser storage keys on mount. CX-005 removed public visitor upload controls. CX-011 removed image requests from the public demo prediction flow. These are code findings, not a claim that a hosted instance was tested.

The public demo's `Load chest X-ray sample` action now loads the owner-provided PNG bundled at `client/src/assets/cxraide-demo-sample.png`. The UI links the NIH Chest X-rays Bbox and VinBigData datasets identified by the owner as training/validation sources. The exact image-to-dataset record match is not verifiable from the flattened attachment. Preset findings remain browser simulation, do not analyze the image, and are covered by a visible non-diagnostic watermark and report text.

The source-backed public demo behavior and privacy findings are recorded in the [demo contract](DEMO_CONTRACT.md). The [CX-010 decision note](CX010_PREDICTION_BOUNDARY.md) records the owner-approved browser simulation direction and the API risk that remains.

The [CX-014 route audit](CX014_PUBLIC_ROUTE_DEPENDENCIES.md) traces each browser route's API and data path. The five showcase routes are source-compatible with static hosting; legacy login and researcher routes still depend on Flask. CX-015 selects only the five showcase routes in production builds and retains legacy routes/services in local development. The public demo uses its own pure color lookup rather than importing `modelService`; generated production assets contain no local Flask URLs or legacy route chunks. Focused contract tests, lint, and production build pass. This is not a hosting or deployment change.

The [CX-016 Vercel preview plan](CX016_VERCEL_PREVIEW_PLAN.md) records current Hobby eligibility and limits, the proposed `client` project root/Vite `dist` settings, SPA routing, protected previews, owner-operated release gates, and rollback. Vercel remains a conditional static-host candidate; no project or deployment has been created.

The [CX-017 metric provenance audit](CX017_METRIC_PROVENANCE.md) links the public Iteration 1 and Iteration 3 mAP and area-based recall values to saved training-notebook outputs. The Iteration 2 mAP, exact AUC bars/aggregate, and plotted precision/recall points lack a verified numeric source; the later weighted-loss experiment trains six classes. The owner authorized conservative treatment, and the Metrics/Research pages now give run context and withhold unsupported exact values.

The [CX-019/020 readiness note](CX019_CX020_RELEASE_READINESS.md) records the local browser pass of all five routes, sample/simulation, expert-box drawing and CSV/PDF export with Flask stopped. Public landing/About copy now distinguishes the hosted simulation from local inference; narrow navigation and native image dragging were corrected. A full browser request log, hosted route behavior, wider responsive/load checks and preview parity remain release gates.

CX-003 added focused Node/Python contract tests; CX-004/005/011 updated the demo tests. No CI workflow, schema, or migrations were found. Python syntax parsing passed for the two server source files. CX-011's focused client contract suite and targeted ESLint pass. Post-change browser interaction with Flask stopped, actual PDF rendering, model accuracy, hosted operation, and provider accounts remain unverified.

## Approved target direction and remaining gates

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

For the **current** public showcase, the approved browser simulation is implemented in `/demo`; confirm the flow in a browser with Flask stopped before release. The result contract labels findings as presets and says they are not image analysis. If a hosted mock API is reconsidered, its output contract, request limits, CORS, abuse controls, logging/retention, and availability require a new review. Do not introduce Supabase solely to satisfy a hypothetical future account system.

Vercel documents Vite support, but Hobby is for personal, non-commercial use; actual eligibility must be checked by the owner. Supabase Free currently has capacity limits and pauses after inactivity, so it is not a default prerequisite for this demo. Supabase Edge Functions use a Deno-compatible runtime with limited memory/CPU, unlike this Python/PyTorch model. Pricing and limits can change; recheck at a hosting decision. Sources: [Vercel Vite](https://vercel.com/docs/frameworks/frontend/vite), [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase pricing](https://supabase.com/pricing), [Edge runtime](https://supabase.com/docs/guides/functions), [Edge limits](https://supabase.com/docs/guides/functions/limits).

If persistence is later approved, use server-verified identity, explicit Postgres constraints/transactions, per-operation grants and RLS, private Storage policies, isolated dry runs, separate database/object backups, ownership and integrity checks, parity tests, rollback, and an owner-controlled cutover. No current data source exists to migrate. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [backup limitations](https://supabase.com/docs/guides/platform/backups) inform that future design.

## Component options and gates

| Area | Retain/refactor | Migrate/replace | Current recommendation and gate |
|---|---|---|---|
| Vue/Vite | Keep current routes and characterize annotation/export behavior; simplify overlapping screens only after use is confirmed. Lower change risk. | Full UI rewrite would require broad interaction and report parity work without a known need. | Retain. Reconsider if focused changes repeatedly cross all three workspace screens. |
| Demo predictions | Keep deterministic, clearly marked browser simulation in public `/demo`; validate result, report, and export parity. | Hosted mock API adds an image-processing and abuse surface; real hosted inference adds large-model runtime needs. | Use the approved browser simulation; retain local Python inference. Reopen API hosting only for a concrete demonstrated need. |
| Python real inference | Retain for local research use and verify with trusted weights. | A new runtime would need model and numeric parity evidence. | Retain. Measure accuracy parity, startup, memory, and latency before any host migration. |
| Identity/data | Keep public demo without accounts or a database. | Supabase Auth/Postgres/Storage would add account and retention obligations without an approved current use. | Defer. Reopen only for an approved persistent radiologist workflow with authorization tests. |

## Phased direction

The current, owner-facing sequence and grouped commit plan are kept at the top of [PROJECT_TASKS.md](../../PROJECT_TASKS.md): CX-017–019 are complete locally, and owner-operated protected preview/release (CX-020) is next. The local researcher/account path remains a later option requiring its own decision.

0. Confirm the demo contract and approved public-upload/privacy policy; validate sample-image rights and the exact research evidence for displayed metrics.
1. Capture current behavior in focused synthetic-data characterization tests and establish a runnable local baseline.
2. In small slices, make the approved public demo reliable and clearly simulated; validate exports, labels, and image handling.
3. Evaluate a free static host versus a hosted mock API with measured resource and privacy needs; perform owner-controlled release gates.
4. Consider accounts and persistence only if the owner approves a new requirement. Do not prebuild a migration for absent authoritative data.
