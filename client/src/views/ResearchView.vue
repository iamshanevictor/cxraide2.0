<template>
  <div class="page">
    <div class="content">
      <div class="container" style="padding: 18px 0 34px">
      <div class="page-head">
          <h1>Study : <span class="highlight">CXRaide 2.0</span></h1>
          <p class="page-subtitle">
            CXRaide 2.0: AI-Assisted Chest X-Ray Annotation and Abnormality Detection
            for PCSC 2025.
          </p>
        </div>

        <UiBadge variant="warning" style="margin-bottom: 12px">
          <i class="bi bi-exclamation-triangle" /> Research prototype — Not for clinical diagnosis
        </UiBadge>


        <div class="grid-2">
          <UiCard title="Problem Statement" subtitle="Why annotation preservation matters">
            <p class="p">
              Chest X-ray interpretation is a high-volume and time-sensitive task. Manual annotation of abnormalities
              requires expert radiologists and can be expensive, time-consuming, and inconsistent.
            </p>
            <p class="p">
              Many existing systems focus on abnormality classification but do not adequately preserve expert
              annotations and precise bounding-box coordinates needed for validation, reproducibility, and future AI training.
            </p>
          </UiCard>

          <UiCard title="System Overview" subtitle="Human-in-the-loop research workflow">
            <p class="p">
              The research workflow combines AI-assisted detection, bounding-box localization, expert annotation,
              and structured report generation. The public demo uses preset simulated findings and lets visitors
              draw annotations and export them locally; local model experiments are a separate workflow.
            </p>
            <div class="pipeline">
              <div v-for="step in workflow" :key="step" class="step"><span class="num">{{ step.number }}</span><span>{{ step.label }}</span></div>
            </div>
          </UiCard>
        </div>

        <div class="grid-3" style="margin-top: 16px">
          <UiCard v-for="objective in objectives" :key="objective.title" :title="objective.title" :subtitle="objective.subtitle">
            <p class="p">{{ objective.body }}</p>
          </UiCard>
        </div>

      <div class="grid-2" style="margin-top: 16px">
          <UiCard title="Datasets" subtitle="Training data sources (curated for detection)">
            <div class="dataset-list">
              <div class="dataset-row">
                <strong>NIH Chest X-ray Dataset</strong>
                <span>112,120 source images; only a selected annotated subset entered the research preprocessing.</span>
              </div>
              <div class="dataset-row">
                <strong>VinBigData Chest X-ray Dataset</strong>
                <span>15,000 source training images; selected annotations were processed with Weighted Box Fusion.</span>
              </div>
              <div class="dataset-row">
                <strong>Final Combined Dataset</strong>
                <span>One saved preprocessing version reports 4,850 unique image IDs; this is not the final model's verified training count.</span>
              </div>
            </div>
          </UiCard>


          <UiCard title="Research Label Vocabulary" subtitle="Nine labels appear in preprocessing and earlier work; the later weighted-loss run trained six classes">
            <div class="tag-panel">
              <span v-for="item in abnormalities" :key="item" class="pill">{{ item }}</span>
            </div>
          </UiCard>
        </div>

        <UiCard title="Data Preprocessing Pipeline" subtitle="From source datasets to detector-ready annotations" style="margin-top: 16px">
          <div class="process-grid">
            <div v-for="item in preprocessing" :key="item" class="process-item">{{ item }}</div>
          </div>
        </UiCard>

        <div class="grid-2" style="margin-top: 16px">
          <UiCard title="Model Architecture" subtitle="SSD300_VGG16 explained simply">
            <p class="p">
              The research models use SSD300_VGG16, an object detection architecture with a nominal 300 × 300 input. It scans a chest X-ray
              image and predicts both abnormality labels and bounding-box locations. VGG16 extracts image features,
              while the SSD detection heads estimate class probabilities, confidence scores, and box coordinates.
            </p>
            <ul class="list">
              <li>VGG16 backbone for feature extraction.</li>
              <li>SSD framework for multi-class object detection.</li>
              <li>Bounding-box localization with confidence scoring.</li>
            </ul>
          </UiCard>

          <UiCard title="Training Strategy" subtitle="Transfer learning and balanced sampling">
            <ul class="list">
              <li>ImageNet pretrained weights for transfer learning.</li>
              <li>Class-weighted loss experiments for imbalance handling.</li>
              <li>SGD optimization with class balancing and stratified sampling.</li>
              <li>Pascal VOC conversion with XML annotation generation.</li>
            </ul>
          </UiCard>
        </div>

        <div class="grid-2" style="margin-top: 16px">
          <UiCard title="Annotation Tool" subtitle="Expert annotation preservation">
            <ul class="list">
              <li>Manual bounding box creation, editing, and zoom support.</li>
              <li>Expert abnormality labeling with local CSV export in the public demo.</li>
              <li>Exported fields include image filename, abnormality label, and bounding-box coordinates.</li>
              <li>CSV export for reproducibility, validation, and future model improvement.</li>
            </ul>
          </UiCard>

          <UiCard title="Report Generation" subtitle="Template-based structured output">
            <p class="p">
              The platform generates structured radiology-style reports with Clinical Indication, Findings,
              Impression, and Recommendations sections. Reports are based on RSNA RadReport-inspired templates
              and refined for consistent chest X-ray documentation.
            </p>
            <div class="callout">Report generation is template-based and intended for research purposes only.</div>
          </UiCard>
        </div>

        <div class="grid-2" style="margin-top: 16px">
          <UiCard title="Key Findings" subtitle="Summary of final iteration">
            <ul class="list">
              <li>The system preserves expert annotations and bounding-box coordinates.</li>
              <li>The later weighted-loss notebook reports higher saved validation mAP at epoch 260; its split and six-class scope differ from the earlier nine-class baseline, so this is not a controlled head-to-head comparison.</li>
              <li>The platform demonstrates the feasibility of combining AI detection, expert annotation, and reporting.</li>
              <li>Localization accuracy remains an area requiring further improvement.</li>
            </ul>
          </UiCard>

          <UiCard title="Research Limitations" subtitle="Important boundaries">
            <ul class="list">
              <li>Bounding-box localization remains imperfect.</li>
              <li>Misclassification still occurs for some abnormalities.</li>
              <li>Dataset imbalance remains a challenge.</li>
              <li>Outputs require expert review and are not clinically validated.</li>
              <li>Results should not replace professional medical interpretation.</li>
            </ul>
          </UiCard>
        </div>

        <UiCard title="Future Directions" subtitle="Next research steps" style="margin-top: 16px">
          <div class="tag-panel">
            <span v-for="item in futureWork" :key="item" class="pill">{{ item }}</span>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script>
import UiCard from "@/ui/UiCard.vue";
import UiBadge from "@/ui/UiBadge.vue";

export default {
  name: "ResearchView",
  components: { UiCard, UiBadge },
  data() {
    return {
      workflow: [
        { number: "1", label: "Upload Chest X-Ray" },
        { number: "2", label: "AI Detection" },
        { number: "3", label: "Expert Review" },
        { number: "4", label: "Export Coordinates" },
        { number: "5", label: "Generate Report" },
        { number: "6", label: "Export CSV/PDF" },
      ],
      objectives: [
        {
          title: "Objective 1",
          subtitle: "Preserve radiologist annotations",
          body: "Preserve radiologist-created annotations and bounding-box coordinates to support validation, reproducibility, and consistent downstream research.",
        },
        {
          title: "Objective 2",
          subtitle: "Improve classification & localization",
          body: "Improve abnormality classification and localization while maintaining radiologist oversight during expert verification.",
        },
        {
          title: "Objective 3",
          subtitle: "Generate standardized reports",
          body: "Generate standardized radiology-style reports using RSNA-inspired templates with Clinical Indication, Findings, Impression, and Recommendations.",
        },
      ],
      abnormalities: [
        "Cardiomegaly",
        "Pleural Thickening",
        "Pulmonary Fibrosis",
        "Pleural Effusion",
        "Nodule / Mass",
        "Infiltration",
        "Consolidation",
        "Atelectasis",
        "Pneumothorax",
      ],
      preprocessing: [
        "Dataset filtering",
        "PA-view selection",
        "Bounding-box validation",
        "Weighted Box Fusion (WBF)",
        "Class balancing",
        "Stratified sampling",
        "Resize to 300×300",
        "Pascal VOC conversion",
        "Weighted boxes → Pascal VOC XML",
      ],
      futureWork: [
        "Larger annotated datasets",
        "Improved localization accuracy",
        "Better classification performance",
        "Lower training loss",
        "NLP-enhanced report generation",
        "Expanded abnormality coverage",
        "Clinical validation studies",
      ],
    };
  },
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }
.content { background: var(--bg); }

.page-head {
  margin-bottom: 8px;
  padding: 6px 2px 0;
}

.page-head h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: 0;
}

.page-subtitle {
  margin: 4px 0 0;
  color: var(--text-2);
  font-size: 13px;
}

.highlight { color: var(--primary); }
.p { margin: 0 0 8px; color: var(--text-2); line-height: 1.5; font-size: 12.5px; }
.list { margin: 0; padding-left: 15px; color: var(--text-2); line-height: 1.5; font-size: 12.5px; }

.pipeline {
  display: flex;
  align-items: stretch;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-weight: 700;
  color: var(--text);
  font-size: 12px;
}

.num {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: var(--primary-soft);
  color: var(--primary);
}

.dataset-list,
.process-grid {
  display: grid;
  gap: 8px;
}

.dataset-row {
  display: grid;
  gap: 3px;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--text-2);
  font-size: 12px;
}

.dataset-row strong { color: var(--text); }

.tag-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.pill,
.process-item {
  display: inline-flex;
  align-items: center;
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-2);
  font-weight: 650;
  font-size: 11.5px;
}

.process-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.process-item {
  border-radius: 8px;
  justify-content: center;
  text-align: center;
}

.callout {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(217,119,6,0.08);
  border: 1px solid rgba(217,119,6,0.22);
  color: var(--text-2);
  font-size: 12px;
}

@media (max-width: 960px) {
  .process-grid { grid-template-columns: 1fr; }
}
</style>
