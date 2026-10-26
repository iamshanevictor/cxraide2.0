# Session handoff

Updated: 2026-10-27. This is a concise working note, not an authorization to deploy.

## Current state

- Documentation bootstrap is complete locally and uncommitted in the working tree; no application code, schemas, dependencies, configuration, or deployment have been changed by this assessment. Baseline Git state before the bootstrap was clean on `main` tracking `origin/main`.
- Owner clarified: public research demo; local real weights; hosted simulated output; no authoritative legacy data; no identifiable patient image/report storage; free hosting preferred; radiologist login is a future concept. Training/metrics provenance exists in a separate repository, location not yet recorded.
- Current code is Vue/Vite plus Flask; no active database or durable jobs. Existing development login and browser offline token are not production identity. See `docs/architecture/ARCHITECTURE.md`.
- Python source syntax parse passed for the two server files. No dependencies or model weights were present locally, so tests, lint, builds, runtime inference and deployed behavior were not verified. No automated test suite or CI workflow was found.
- The existing public `Load sample` action creates a synthetic gradient/noise image, not an actual sample chest X-ray. Source and rights for a suitable sample are unresolved.

## Decisions and gates

- ADR-001 records owner-stated scope. ADR-002 and ADR-003 are proposed, pending review. Do not start application implementation from them.
- Owner decisions after CX-001: public-upload policy; browser image retention; whether hosted Flask adds value over a static simulated demo; sample-image rights; separate provenance repository URL and metric mapping; whether/when real radiologist accounts are in scope.
- Account, billing, DNS, production deployment, real-data and destructive actions remain owner-operated gates.

## Next action

`CX-001` is the sole `READY` task: read-only mapping of the public demo contract and privacy paths. On completion, record source evidence in architecture/task notes and update this handoff. CX-002 then awaits owner review. Do not infer a detailed implementation backlog yet.
