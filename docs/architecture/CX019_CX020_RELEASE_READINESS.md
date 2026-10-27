# CX-019 local validation and CX-020 release readiness

Checked 2026-10-27 against the built Vite preview at `127.0.0.1:5173` with Flask stopped. This note records local evidence and the remaining owner-operated release gates; it is not a deployment record.

## Local evidence

| Check | Result and limit |
|---|---|
| Public routes | `/`, `/demo`, `/research`, `/metrics`, and `/about` rendered in the browser. Direct `/login` returned to `/`. The Vercel SPA rewrite has not been tested on Vercel. |
| Research claims | Metrics displays saved epoch-150/260 mAP and area recall with run/split context. Unsupported exact Iteration 2 and AUC numbers are withheld; the precision/recall chart is labelled schematic. Research distinguishes source dataset totals, a preprocessing-version count, and the later six-class run. |
| Demo and exports | The bundled sample loaded; two preset findings and the research-only watermark appeared. After disabling native image dragging, a pointer drag created a Cardiomegaly expert box. CSV downloaded with the sample filename and display-pixel coordinates `275,317,80,70`. A simulated report generated and a PDF downloaded (174,355 bytes). Only the approved bundled sample was used. |
| Browser and artifact checks | The browser reported no console errors/warnings during this pass. With Flask stopped, the exercised routes and demo actions worked. A bounded search of built assets found no `localhost:5000`, `/api/predict`, `/api/model-status`, or `check-session`. The browser tool did not expose a full request log, so absence of every possible network request was not independently proven. |
| Deterministic checks | `node --test tests/demo-contract.test.cjs` passed 8/8. Targeted ESLint for the changed public views passed. `npm run build` passed and emitted the public chunks and sample. Vite still warns that the demo chunk is about 997 KB before gzip; measure constrained-network load time on the hosted preview. |
| Responsive layout | The narrow browser viewport exposed a clipped landing header; it was corrected and visually rechecked. Wider breakpoints and device/browser combinations have not been systematically tested. |

Browser export checks created `CXRaide_Report_2026-10-27.pdf` and `cxraide_annotations_2026-10-27.csv` in the local Downloads folder. They are test outputs, not repository assets or hosted records.

## Remaining gates for CX-020

1. **Publication:** The owner reviews the corrected claims and the [metric source mapping](CX017_METRIC_PROVENANCE.md). The exact original dataset record for the flattened sample remains unknown; the owner must accept the recorded provenance/permission position before publishing the image.
2. **Host and account:** The owner confirms current Vercel Hobby eligibility for this personal, noncommercial showcase, selects the repository/branch, and links their account. No Vercel project or CLI link was found locally. Do not commit a private preview URL or account data.
3. **Protected preview:** Configure the `client` root, Vite build, `dist` output, and the existing SPA rewrite from the [CX-016 plan](CX016_VERCEL_PREVIEW_PLAN.md). Keep preview protection on. Verify the exact commit SHA, build result, five direct routes and local-only route fallback.
4. **Preview parity:** In the protected preview, repeat sample load, drawing, simulation, CSV/PDF export, disclaimers and corrected claims. Inspect the actual browser request log for any backend request or unexpected data transfer. Check mobile and wider layout plus load time on a constrained connection. Record failures and fix them before promotion.
5. **Public release:** The owner reviews the preview evidence, selects production access and any DNS action, and explicitly approves promotion. The first deployment has no earlier production version to roll back to; confirm the host's current protection/withdrawal control before opening it publicly.

Suggested commit title for the local claim and stabilization milestone: `fix: align public research demo`.
