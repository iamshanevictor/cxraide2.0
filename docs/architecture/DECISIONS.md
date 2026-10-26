# Architecture decision log

Each entry states its status. A proposal is not authorization to implement or operate cloud services.

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
- Status: **PROPOSED — awaiting owner review**
- Context: The owner prefers free hosting. Vite can be hosted statically; large Python/PyTorch weights are a poor fit for current hosted request handling. No current persistent data requirement is approved.
- Alternatives: (A) static public demo with labeled browser simulation; (B) Vercel frontend plus hosted mock Flask API; (C) move API and identity to Supabase; (D) full rewrite.
- Proposed decision: Evaluate A against the existing demo contract first. Retain a separate local Python real-model path. Use B only if its hosted API adds demonstrable value. Defer Supabase Auth/Postgres/Storage until a persistent workflow is approved; Edge Functions are suitable only for short compatible tasks.
- Consequences: Sample-image licensing, simulation parity, privacy, browser storage, free-plan eligibility and deployment behavior become acceptance gates. No backend host is selected.
- Supersedes: none; the README's Vercel path remains a configuration claim, not an approved deployment decision.

## ADR-003 — Incremental change and rule ownership

- Date: 2026-10-27
- Status: **PROPOSED — awaiting owner review**
- Context: The Vue screens overlap, tests are absent, and inference/identity paths have unverified behavior.
- Alternatives: full rewrite; incremental characterization and vertical slices.
- Proposed decision: Retain working Vue and Python code. Characterize sample/demo, export, mode selection, and local inference before changing them. Put consequential validation and any future authorization at a verified server boundary; do not trust browser-supplied ownership. Use one authoritative owner per business rule.
- Consequences: Early work is testing and contract discovery; simplification or retirement of a screen needs owner review and evidence.
- Supersedes: none.
