<template>
  <div class="page">
    <div class="container" style="padding: 18px 0 34px">
      <div class="page-head">
        <h1>About / Team : <span class="highlight">CXRaide 2.0</span></h1>
      </div>

      <UiBadge variant="warning" style="margin-bottom: 12px">
        <i class="bi bi-exclamation-triangle" /> For research and demonstration only
      </UiBadge>

      <div class="grid-2">
        <UiCard title="Project" subtitle="What CXRaide 2.0 is">
          <p class="p">
            CXRaide 2.0 is a chest X-ray annotation research prototype. The public demo lets visitors
            annotate a bundled sample, export boxes to CSV, explore preset simulated findings, and generate a demo report.
            SSD300_VGG16 model experiments run separately in the local research workflow.
          </p>
          <div class="callout">
            This platform is not a medical device. It must not be used for clinical diagnosis or treatment decisions.
          </div>
        </UiCard>

        <UiCard title="Team" subtitle="Research prototype authors">
          <p class="p" style="margin-top:0;">
            CXRaide 2.0 is presented as a research prototype for PCSC 2025.
            Author and institution details are pending publication verification.
          </p>
        </UiCard>

        <UiCard title="Citation" subtitle="How to reference">
          <div class="mono">
            CXRaide 2.0: AI-Assisted Chest X-Ray Annotation and Abnormality Detection.
            Philippine Computing Science Congress (PCSC) 2025.
            
            Use the associated paper citation when available.
          </div>
          <div style="margin-top: 12px">
            <UiButton variant="secondary" icon="bi bi-journal-text" @click="$router.push('/research')">
              View study page
            </UiButton>
          </div>
        </UiCard>


        <UiCard title="Purpose" subtitle="Why it exists">
          <ul class="list">
            <li>Explore AI-assisted labeling workflows</li>
            <li>Make annotations reproducible (coordinates + classes)</li>
            <li>Visualize performance metrics and iterations</li>
          </ul>
        </UiCard>
      </div>

      <UiCard title="Disclaimer" subtitle="Research use only" style="margin-top: 16px">
        <p class="p" style="margin: 0">
          All outputs are provided “as-is” for education and research. Model predictions may be incorrect.
          Do not use on real patients.
        </p>
      </UiCard>
    </div>
  </div>
</template>

<script>
import UiCard from "@/ui/UiCard.vue";
import UiButton from "@/ui/UiButton.vue";
import UiBadge from "@/ui/UiBadge.vue";

export default {
  name: "AboutView",
  components: { UiCard, UiButton, UiBadge },
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

.p { color: var(--text-2); line-height: 1.42; margin: 0; font-size: 12px; }
.list { margin: 0; padding-left: 15px; color: var(--text-2); line-height: 1.45; font-size: 12px; }
.callout {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(220,38,38,0.06);
  border: 1px solid rgba(220,38,38,0.18);
  color: var(--text-2);
}
.mono {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11.5px;
  color: var(--text-2);
}
</style>
