# CX-014 — Public route dependency audit

Source audit: 2026-10-27. This describes code paths, not observed hosted traffic. Manual browser/network testing remains deferred by the owner.

## Route map

| Browser route | Source-observed network/data path | Static showcase classification |
|---|---|---|
| `/` | `LandingSaaSView.vue` renders bundled UI; no API call found. | Static-compatible. |
| `/demo` | `DemoWorkspaceView.vue` fetches the bundled sample PNG, applies fixed findings in the browser, draws boxes in memory, and exports locally. Its `ModelService` use is the pure color helper. Dataset/paper links leave the site only when opened. | Static-compatible for the intended public demo. No Flask prediction call on this page. |
| `/research` | `ResearchView.vue` renders bundled content; no API call found. | Static-compatible. |
| `/metrics` | `MetricsDashboardView.vue` renders bundled chart/content; no API call found. | Static-compatible technically; exact displayed metric-to-run provenance remains a publication gate. |
| `/about` | `AboutView.vue` renders bundled content; no API call found. | Static-compatible. |
| `/login` | `LoginView.vue` calls `GET /health` on creation and sends username/password to `POST /login`; stores the returned token in browser localStorage. | Needs Flask. This is legacy local development login, not a production radiologist account. |
| `/home` | Protected by router; checks `GET /check-session` for ordinary tokens, then calls health/session/model status; logout tries `POST /logout`. | Needs Flask for intended behavior. No Flask `/logout` route was found. |
| `/annotate` | Protected by router; calls `GET /api/model-status` and sends a resized image as multipart `image` to `POST /api/predict`; receives findings and image representations. | Needs Flask and local model runtime. |
| `/upload-cxr` | Protected by router; calls model status and posts multipart `image` plus `model_type` to `/api/predict`; receives findings and image representations. | Needs Flask and local model runtime. |

The router imports `modelService` and `checkSession` globally. Public navigation cancels pending model requests but does not itself issue an API request. The `App.vue` and `PublicLayout.vue` wrappers do not add public-route API calls. The `fetch(dataUrl)` helper in the demo reads a browser data URL and was not found as a call site. Source: `client/src/router/index.js`, `client/src/views/*View.vue`, `client/src/components/PublicLayout.vue`, `client/src/services/modelService.js`, and `client/src/utils/api.js`.

## Hosting and trust boundary

**Observed:** `client/vercel.json` rewrites browser paths to the SPA entry point. `client/src/utils/api.js` defaults `VITE_API_BASE_URL` to `http://localhost:5000`; on a public static host that means the visitor's computer. A rewrite serves `/login` and protected pages as frontend pages but supplies no Flask service. The router accepts unsigned offline tokens when its session check reports a network error. Flask development login accepts a username without checking a password when `ALLOW_DEV_LOGIN` is enabled. `server/model_service.py` has no verified authorization check on `/api/predict`; the endpoint reads uploaded image bytes if directly reachable. A token sent by the client is not protection unless the server verifies it.

**Inference:** The minimum workable public showcase is a static Vue build serving `/`, `/demo`, `/research`, `/metrics`, and `/about`, including the bundled sample. It needs no hosted Flask, database, or image storage for the implemented demo interaction. Deploying the current SPA without a public-route boundary would also expose nonfunctional or misleading login/researcher screens. Exposing the Flask backend would add an image-upload and abuse/retention surface beyond the approved public demo. Source review cannot establish host access logs, browser requests, image handling by infrastructure, or actual deployment behavior.

**Recommendation for owner review:** In a subsequent small task, make the public build's navigation and route handling include only the five showcase pages, while preserving local legacy researcher pages and Flask for local use. Keep research-only and simulated-result labels visible. Do not connect a public prediction API or present development login as a real account system. This is a proposal, not an approved hosting decision.

## Verification still needed

- At end-stage manual validation, load every public path on the candidate static host with Flask stopped; inspect the browser network log for API calls and exported PDF behavior.
- Confirm build-mode behavior and the public navigation boundary after it is implemented. Direct URL entry to legacy paths must have an intentional result.
- Before publication, resolve the exact displayed metric-to-training-run mapping and the remaining sample provenance/rights gate recorded in `SAMPLE_PROVENANCE.md`.
- Recheck provider eligibility, limits, logging, and current pricing at a concrete hosting decision. No account, DNS, or deployment action was taken here.
