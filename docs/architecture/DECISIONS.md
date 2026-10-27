# Architecture decision log

Each entry states its status. Approval of a direction does not mean its implementation is complete or authorize account, billing, DNS, or production deployment actions.

## ADR-001 — Research showcase and data boundary

- Date: 2026-10-27
- Status: **Owner-stated scope; implementation details proposed**
- Context: The owner clarified that this is a public research demo, local real models are available separately, hosted results are simulated, and no authoritative Firebase/database/file/account records remain.
- Alternatives: build a clinical record system now; preserve the current research/demo scope.
- Decision: Treat the public research demo as current scope. Do not store identifiable patient images or reports. Keep real inference local and label simulated results. Do not perform a legacy data migration without discovering a real authoritative source.
- Consequences: Patient-form and protected-workspace behavior require review before public use. A future radiologist service needs its own approved requirements and identity/security design.
- Supersedes: any implied future database migration in the 2026-10-27 initial assessment; no prior in-repository ADR exists.

## ADR-002 — Hosting and backend shape

- Date: 2026-10-27
- Status: **APPROVED by owner, 2026-10-27 (D1–D6); implementation pending**
- Context: The owner prefers free hosting. Vite can be hosted statically; large Python/PyTorch weights are a poor fit for current hosted request handling. No current persistent data requirement is approved. The [CX-002 decision package](CX002_DECISION_PACKAGE.md) records the source-backed D1–D6 choices the owner accepted.
- Alternatives: (A) static public demo with labeled browser simulation; (B) Vercel frontend plus hosted mock Flask API; (C) move API and identity to Supabase; (D) full rewrite.
- Decision: The public page uses approved sample images only (D1) and does not automatically retain images in browser storage; deliberate export remains available (D2). Evaluate clearly labeled browser simulation first against the existing demo contract (D3); retain a separate local Python real-model path and use a hosted mock API only if it adds demonstrated value. Vercel Hobby is the first static-host candidate, conditional on personal non-commercial eligibility and preview validation, rather than a selected deployment (D4). Radiologist sign-in remains a future concept; preserve the existing screens for separate review without representing their development login as real access (D5). Label hosted findings simulated, use model names only with a tested mapping, and do not assert exact published metrics until linked to experiment and checkpoint evidence (D6). Defer Supabase Auth/Postgres/Storage until a persistent workflow is approved; Edge Functions are suitable only for short compatible tasks.
- Consequences: Sample-image licensing, de-identification and metadata review; removal of the current public upload and automatic browser-retention behavior; simulation parity; free-plan eligibility; and deployment behavior are implementation or release gates. Exact UI metric-to-run/checkpoint mapping remains unverified and is a publication gate. No backend host or provider account is selected.
- Supersedes: none; the README's Vercel path remains a configuration claim, not an approved deployment decision.

## ADR-003 — Incremental change and rule ownership

- Date: 2026-10-27
- Status: **APPROVED by owner, 2026-10-27 (D7); implementation pending**
- Context: The Vue screens overlap, tests are absent, and inference/identity paths have unverified behavior.
- Alternatives: full rewrite; incremental characterization and vertical slices.
- Decision: Retain working Vue and Python code. Characterize sample/demo, export, mode selection, and local inference before changing them. Improve in small vertical slices. Put consequential validation and any future authorization at a verified server boundary; do not trust browser-supplied ownership. Use one authoritative owner per business rule.
- Consequences: Early work is testing and contract discovery; simplification or retirement of a screen needs owner review and evidence.
- Supersedes: none.

## ADR-004 — Public demo prediction boundary

- Date: 2026-10-27
- Status: **APPROVED by owner, 2026-10-27**
- Context: The public UI has no upload controls, but it sends a derived image to the unauthenticated Flask prediction route, which accepts image uploads directly. Hosted output is meant to be simulated, and the owner prefers low-cost hosting. [CX-010's source review](CX010_PREDICTION_BOUNDARY.md) records the current contract and tradeoffs.
- Alternatives: browser simulation for the public demo; host the current Flask mock path after repair and hardening; or host a new sample-ID-only mock endpoint.
- Decision: Use repeatable, explicitly labeled browser scenarios for the public `/demo` route. Keep Python inference for local research. Do not expose the current image-upload endpoint as part of a static public demo.
- Consequences: A scoped client change needs result/report parity and browser-network validation. Sample rights, metric mapping, static-host eligibility, and deployment remain separate gates. Approval authorizes the bounded CX-011 client slice, not hosting or deployment.
- Supersedes: none; refines approved ADR-002 direction D3 after owner approval.
