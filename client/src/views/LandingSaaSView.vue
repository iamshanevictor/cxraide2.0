<template>
  <div class="landing">
    <header class="topbar">
      <div class="container topbar-inner">
        <RouterLink class="brand" to="/" aria-label="CXRaide home">
          <img class="logo" src="@/assets/LOGO2.png" alt="" />
        </RouterLink>

        <nav class="links" aria-label="Primary">
          <RouterLink :to="{ path: '/', hash: '#overview' }">Overview</RouterLink>
          <RouterLink to="/research">Study</RouterLink>
          <RouterLink to="/metrics">Metrics</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>

        <div class="cta">
          <UiButton variant="ghost" @click="$router.push('/research')">View Study</UiButton>
          <UiButton variant="primary" @click="$router.push('/demo')">Open Prototype</UiButton>
        </div>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container hero-inner">
          <div class="copy">
            <UiBadge variant="info">
              <i class="bi bi-shield-check" /> Research prototype — educational & research use only
            </UiBadge>

            <h1>
              AI-Assisted Chest X-Ray Annotation and Abnormality Detection
              <span class="title-accent">(CXRaide 2.0)</span>
            </h1>

            <p class="lead">
              Explore a chest X-ray sample, draw bounding-box annotations, view preset simulated findings,
              and export research demo results. Trained model inference is a separate local research workflow.
            </p>

            <div class="hero-actions">
              <UiButton variant="primary" size="lg" icon="bi bi-journal-text" @click="$router.push('/research')">
                Read the Study
              </UiButton>
              <UiButton variant="secondary" size="lg" icon="bi bi-graph-up" @click="$router.push('/metrics')">
                View Results
              </UiButton>
            </div>

            <div class="pill-row" aria-label="Highlights">
              <span class="pill"><i class="bi bi-cpu" /> SSD300_VGG16</span>
              <span class="pill"><i class="bi bi-bounding-box" /> Bounding boxes → CSV</span>
              <span class="pill"><i class="bi bi-file-earmark-medical" /> Structured report templates</span>
              <span class="pill"><i class="bi bi-people" /> Expert review workflow</span>
            </div>
          </div>

          <div class="preview">
            <UiCard title="PCSC 2025 Research Prototype" subtitle="Research Prototype">
              <div class="preview-grid">
                
                <div class="preview-item">
                  <div class="k">Research Type</div>
                  <div class="v">Artificial Intelligence for Medical Imaging</div>
                </div>
                <div class="preview-item">
                  <div class="k">Pipeline</div>
                  <div class="v">Sample → Annotate → Simulate → Export</div>
                </div>
                <div class="preview-item">
                  <div class="k">Data</div>
                  <div class="v">NIH + VinBig</div>
                </div>
                <div class="preview-item">
                  <div class="k">Status</div>
                  <div class="v">Research Prototype</div>
                </div>
              </div>
              <div class="disclaimer">
                Research prototype for educational and research purposes only. Outputs are not clinically validated
                and should not be used for medical diagnosis.
              </div>
            </UiCard>
          </div>
        </div>
      </section>

      <section id="overview" class="section">
        <div class="container">
          <div class="section-head">
            <h2>Solving a time-sensitive clinical workflow (research focus)</h2>
            <p class="text-muted">
              Chest X-ray interpretation is time-sensitive and requires expert radiologists. This public prototype
              demonstrates annotation and review with a sample image and preset simulated findings.
            </p>
          </div>

          <div class="grid-2">
            <UiCard title="The Research Problem" subtitle="Annotation is labor-intensive & inconsistent">
              <p class="p">
                Manual annotation is labor-intensive, expensive, and can vary between experts. Systems that only output labels
                often fail to preserve the expert bounding-box coordinates required for validation, reproducibility, and future model training.
              </p>
            </UiCard>

            <UiCard title="Local Model Research" subtitle="SSD300_VGG16 experiments">
              <ul class="list">
                <li>Separate local experiments explore abnormality localization and confidence scoring.</li>
                <li>The hosted demo shows preset examples; it does not analyze the sample image.</li>
                <li>Research outputs require expert review and are not clinical decisions.</li>
              </ul>
            </UiCard>

            <UiCard title="Expert Annotation Tooling" subtitle="Boxes, editing, and CSV export">
              <ul class="list">
                <li>Manual bounding boxes with bounding-box editing.</li>
                <li>CSV export for annotation preservation.</li>
                <li>Review-ready workflow for repeatable research studies.</li>
              </ul>
            </UiCard>

            <UiCard title="Structured Reporting" subtitle="Findings, Impression, Recommendations + PDF export">
              <ul class="list">
                <li>Template-based structured output for consistent documentation.</li>
                <li>Report sections include Findings, Impression, and Recommendations.</li>
                <li>PDF export to support paper-ready documentation workflows.</li>
              </ul>
            </UiCard>
          </div>

          <div class="bottom-cta">
            <UiButton variant="primary" size="lg" icon="bi bi-play-circle" @click="$router.push('/demo')">
              Open Prototype Workspace
            </UiButton>
          </div>
        </div>
      </section>

      <section class="research-fill">
        <div class="container">
          <div class="section-head compact-head">
            <h2>End-to-end research workflow</h2>
            <p class="text-muted">
              The public demo combines a sample image, manual review, local coordinate export, and a simulated report.
              Model inference remains a separate local research workflow.
            </p>
          </div>

          <div class="info-grid timeline-grid" aria-label="Workflow timeline">
            <div v-for="step in workflow" :key="step.index" class="info-tile">
              <div class="info-kicker">Step {{ step.index }}</div>
              <h3>{{ step.label }}</h3>
              <p>{{ step.detail }}</p>
            </div>
          </div>

          <div class="feature-strip">
            <div class="strip-card">
              <div class="strip-title"><i class="bi bi-diagram-3"></i> Research Pipeline</div>
              <div class="strip-text">
                NIH and VinBigData research sources, saved validation results, and a performance dashboard with run context.
              </div>
            </div>
            <div class="strip-card">
              <div class="strip-title"><i class="bi bi-file-earmark-text"></i> Export Outputs</div>
              <div class="strip-text">Export CSV for bounding boxes and PDF for structured reports.</div>
            </div>
            <div class="strip-card">
              <div class="strip-title"><i class="bi bi-check2-circle"></i> Human-in-the-loop Review</div>
              <div class="strip-text">Visitors can edit annotations; preset findings demonstrate a possible expert review flow.</div>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container footer-inner">
          <div>
            <div class="foot-brand">CXRaide 2.0</div>
            <div class="text-muted">PCSC 2025 research prototype • AI-assisted CXR annotation & detection</div>
          </div>
          <div class="footer-links">
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/research">Study</RouterLink>
            <RouterLink to="/metrics">Metrics</RouterLink>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import UiButton from "@/ui/UiButton.vue";
import UiCard from "@/ui/UiCard.vue";
import UiBadge from "@/ui/UiBadge.vue";

export default {
  name: "LandingSaaSView",
  components: { UiButton, UiCard, UiBadge },
  data() {
    return {
      workflow: [
        {
          index: "1",
          label: "Load Public Sample",
          detail: "Load the bundled chest X-ray sample into the public workspace.",
        },
        {
          index: "2",
          label: "Show Simulated Findings",
          detail: "Preset example labels and boxes illustrate a result; no model analyzes the sample.",
        },
        {
          index: "3",
          label: "Expert Review",
          detail: "Draw and edit expert-style bounding boxes on the sample image.",
        },
        {
          index: "4",
          label: "Review Bounding Boxes",
          detail: "Review coordinates and labels before a local CSV export.",
        },
        {
          index: "5",
          label: "Generate Report",
          detail: "Generate a research-only template report from the simulated demo scenario.",
        },
        {
          index: "6",
          label: "Export CSV / PDF",
          detail: "Export annotation CSV and research-ready PDF report output.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(900px 320px at 20% 0%, rgba(37,99,235,0.10), transparent 55%),
    radial-gradient(900px 360px at 80% 10%, rgba(14,165,233,0.10), transparent 55%),
    var(--bg);
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(15,23,42,0.78);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

:global(body.theme-light) .topbar {
  background: rgba(255,255,255,0.85);
}

.topbar-inner {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.brand {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
}

.brand:hover { background: rgba(30,41,59,0.35); }
:global(body.theme-light) .brand:hover { background: rgba(15,23,42,0.06); }

.logo { height: 22px; width: auto; max-width: 190px; object-fit: contain; display: block; }

.links { display: flex; align-items: center; gap: 10px; color: var(--text-2); }
.links a { color: var(--text-2); font-weight: 600; font-size: 13px; }
.links a:hover { color: var(--primary); text-decoration: none; }

.cta { display: flex; align-items: center; gap: 6px; }

@media (max-width: 860px) {
  .links { display: none; }
}

@media (max-width: 520px) {
  .logo { max-width: 170px; }
  .cta > :first-child { display: none; }
}

.hero { padding: 34px 0 18px; }
.hero-inner { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 22px; align-items: start; }
@media (max-width: 980px) { .hero-inner { grid-template-columns: 1fr; } }

.copy h1 { font-size: 34px; line-height: 1.12; margin: 12px 0 9px; letter-spacing: -0.01em; }
.lead { color: var(--text-2); font-size: 14px; line-height: 1.52; max-width: 68ch; }

.hero-actions { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }

.pill,
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(30,41,59,0.45);
  color: var(--text-2);
  font-weight: 650;
  font-size: 12px;
}

:global(body.theme-light) .pill,
:global(body.theme-light) .tag { background: rgba(255,255,255,0.7); }

.preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.preview-item .k { color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.preview-item .v { margin-top: 3px; font-size: 16px; font-weight: 800; color: var(--text); }

.disclaimer { margin-top: 10px; padding: 8px 10px; border-radius: 8px; background: var(--surface-2); color: var(--text-2); font-size: 12px; }

.section { padding: 24px 0 18px; }
.section-head { margin-bottom: 12px; }
.section-head h2 { margin: 0 0 5px; font-size: 20px; }

#overview { scroll-margin-top: 66px; }

.title-accent {
  color: var(--primary);
  font-weight: 900;
  letter-spacing: -0.02em;
}

.feature-strip {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.strip-card {
  min-height: 120px;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.62);
}

.strip-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  font-weight: 850;
}

.strip-title i {
  color: var(--primary-2);
}

.strip-text {
  margin-top: 10px;
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.55;
}

@media (max-width: 980px) {
  .feature-strip { grid-template-columns: 1fr; }
}


.p { margin: 0; color: var(--text-2); line-height: 1.55; font-size: 13px; }
.list { margin: 0; padding-left: 17px; color: var(--text-2); line-height: 1.55; font-size: 13px; }

.bottom-cta { margin-top: 14px; display: flex; justify-content: center; }

.research-fill {
  padding: 18px 0 36px;
}

.compact-head {
  max-width: 780px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.timeline-grid {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.info-tile {
  min-height: 138px;
  padding: 13px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.62);
}

.info-kicker {
  color: var(--primary-2);
  font-size: 11px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.info-tile h3 {
  margin: 6px 0 6px;
  color: var(--text);
  font-size: 14px;
}

.info-tile p {
  margin: 0;
  color: var(--text-2);
  font-size: 12.5px;
  line-height: 1.48;
}

@media (max-width: 1100px) {
  .info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .timeline-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 640px) {
  .info-grid { grid-template-columns: 1fr; }
  .timeline-grid { grid-template-columns: 1fr; }
}

.tag-head {
  margin-top: 18px;
}

.tag-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.62);
}

.footer { margin-top: auto; border-top: 1px solid var(--border); padding: 16px 0; background: rgba(15,23,42,0.55); }
:global(body.theme-light) .footer { background: rgba(255,255,255,0.55); }
.footer-inner { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.foot-brand { font-weight: 850; }
.footer-links { display: flex; gap: 10px; }
.footer-links a { color: var(--text-2); font-weight: 650; }
</style>

