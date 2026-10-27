<template>
  <div class="page">
    <div class="container" style="padding: 18px 0 34px">
      <div class="page-head">
        <h1>Results / Metrics : <span class="highlight">Dashboard</span></h1>
      </div>

      <div class="grid-3">
        <UiCard title="mAP" subtitle="Saved validation output (AP@[0.50:0.95])">
          <div class="big">31.02%</div>
          <div class="text-muted">Weighted-loss run, epoch 260 · VERSION_3 validation · six classes</div>
          <div class="metric-help">
            mAP aggregates detection quality across IoU thresholds (0.50 → 0.95). A prediction only counts as correct when the predicted bounding box overlaps the ground-truth box by at least the threshold IoU; averaging across thresholds rewards both finding the abnormality and localizing it precisely.
          </div>
        </UiCard>
        <UiCard title="Recall" subtitle="Area-based Average Recall">
          <div class="big">83.6–91.4%</div>
          <div class="text-muted">Small to large areas, epoch 260 · VERSION_3 validation</div>
          <div class="metric-help" aria-live="polite">
            Recall is the fraction of ground-truth abnormalities that the model detects (i.e., produces a matching prediction). The displayed range reflects that smaller vs. larger abnormalities are detected with different success rates—higher recall means fewer missed findings.
          </div>
        </UiCard>
        <UiCard title="AUC" subtitle="Per-abnormality evaluation">
          <div class="big">Not verified</div>
          <div class="text-muted">Exact numeric AUC values are pending a matched run and validation split.</div>
          <div class="metric-help" aria-live="polite">
            AUC (Area Under the ROC Curve) summarizes how a model ranks abnormal versus normal cases across decision thresholds. The training notebook contains an ROC plot, but its exact class values and evaluation cohort have not been verified for this dashboard.
          </div>
        </UiCard>

      </div>

      <div class="grid-2" style="margin-top: 16px">
        <UiCard title="Saved validation results" subtitle="Different experiment versions and class sets; not a head-to-head comparison">
          <ChartCanvas :config="iterationConfig" />
        </UiCard>

        <UiCard title="Class performance" subtitle="Numeric AUC table pending verification">
          <p class="text-muted">The published training notebook includes an ROC figure, but no numeric AUC table tied to the same validation split as the epoch-260 mAP result. Exact class values will be shown here when their run and cohort are verified.</p>
        </UiCard>
      </div>

      <div class="grid-2" style="margin-top: 16px">
        <UiCard title="Precision/Recall" subtitle="Illustrative tradeoff — not measured CXRaide results">
          <ChartCanvas :config="prConfig" />
        </UiCard>

        <UiCard title="Notes" subtitle="How to interpret the charts">
          <ul class="list">
            <li>
              <strong>Saved mAP outputs:</strong> the baseline notebook reports 0.92% at epoch 150 on VERSION_2 validation; the weighted-loss notebook reports 31.02% at epoch 260 on VERSION_3 validation. The splits and trained class sets differ, so these bars do not establish a controlled improvement.
            </li>
            <li>
              <strong>AUC by abnormality:</strong> exact numeric values remain unverified for a matched run and cohort; the ROC figure in the training notebook is research context only.
            </li>
            <li>
              <strong>Precision/Recall tradeoff:</strong> the chart is schematic, not measured CXRaide performance. As the confidence threshold rises, precision often increases and recall can decrease. A real operating threshold would require a verified evaluation and expert review.
            </li>
          </ul>
          <div style="margin-top: 12px">
            <UiButton variant="primary" icon="bi bi-play-circle" @click="$router.push('/demo')">Open demo workspace</UiButton>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script>
import UiCard from "@/ui/UiCard.vue";
import UiButton from "@/ui/UiButton.vue";
import ChartCanvas from "@/components/charts/ChartCanvas.vue";

export default {
  name: "MetricsDashboardView",
  components: { UiCard, UiButton, ChartCanvas },
  computed: {
    iterationConfig() {
      return {
        type: "bar",
        data: {
          labels: ["Baseline · epoch 150 · V2", "Weighted · epoch 260 · V3"],
          datasets: [
            {
              label: "Saved mAP (AP@[0.50:0.95])",
              data: [0.0092, 0.3102],
              borderColor: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.10)",
              fill: true,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (v) => `${Math.round(v * 100)}%` },
            },
          },
        },
      };
    },
    prConfig() {
      return {
        type: "line",
        data: {
          labels: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
          datasets: [
            {
              label: "Precision",
              data: [0.41, 0.49, 0.57, 0.62, 0.66, 0.70, 0.73, 0.76, 0.78],
              borderColor: "#2563eb",
              tension: 0.3,
              pointRadius: 0,
            },
            {
              label: "Recall",
              data: [0.92, 0.90, 0.86, 0.80, 0.72, 0.63, 0.55, 0.44, 0.34],
              borderColor: "#16a34a",
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: {
            x: { title: { display: true, text: "Confidence threshold" } },
            y: { beginAtZero: true, suggestedMax: 1.0 },
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.page-head {
  margin-bottom: 8px;
  padding: 6px 2px 0;
}

.page-head h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.01em;
}

.highlight { color: var(--primary); }

.list { margin: 0; padding-left: 15px; color: var(--text-2); line-height: 1.45; font-size: 12px; }

.big { font-size: 24px; font-weight: 900; letter-spacing: -0.01em; color: var(--text); }
</style>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }
.big { font-size: 24px; font-weight: 900; letter-spacing: -0.01em; color: var(--text); }
.list { margin: 0; padding-left: 15px; color: var(--text-2); line-height: 1.45; font-size: 12px; }
</style>
