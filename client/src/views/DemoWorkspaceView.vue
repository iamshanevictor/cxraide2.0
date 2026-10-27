<template>
  <div class="page">
    <div class="container" style="padding: 18px 0 28px">
      <div class="page-head">
        <h1>
          Demo Workspace : <span class="highlight">Annotate + Explore + Report</span>
        </h1>
        <div class="subtitle">
          Keyboard: <span class="kbd">E</span> expert, <span class="kbd">A</span> simulated findings, <span class="kbd">Del</span> delete box
        </div>
      </div>

      <div class="grid">
        <!-- Left: sample + controls -->
        <UiCard title="Image" subtitle="Use the public research sample" class="panel">
          <div class="stack">
            <div class="hint text-muted">Project training/validation sample for annotation practice. Preset results are simulated and do not analyze this image. Your session changes are not saved between visits.</div>
            <div class="hint text-muted">Dataset sources: <a href="https://www.kaggle.com/datasets/huthayfahodeb/nih-chest-x-rays-bbox-version" target="_blank" rel="noopener noreferrer">NIH Chest X-rays Bbox</a> and <a href="https://www.kaggle.com/c/vinbigdata-chest-xray-abnormalities-detection" target="_blank" rel="noopener noreferrer">VinBigData</a>. NIH data provider: NIH Clinical Center. See the <a href="https://nihcc.app.box.com/v/ChestXray-NIHCC" target="_blank" rel="noopener noreferrer">NIH source</a> and <a href="https://openaccess.thecvf.com/content_cvpr_2017/papers/Wang_ChestX-ray8_Hospital-Scale_Chest_CVPR_2017_paper.pdf" target="_blank" rel="noopener noreferrer">Wang et al., CVPR 2017</a>.</div>

            <div class="row">
              <UiButton variant="secondary" icon="bi bi-image" :disabled="isPredicting" @click="loadDemoSample">
                Load chest X-ray sample
              </UiButton>
              <UiButton variant="ghost" icon="bi bi-trash" :disabled="!imageUrl || isPredicting" @click="clearImage">
                Clear
              </UiButton>
            </div>

            <div class="hr" />

            <div class="field">
              <label>Annotation label</label>
              <select v-model="selectedLabel">
                <option v-for="a in abnormalities" :key="a" :value="a">{{ a }}</option>
              </select>
              <div class="hint text-muted">Used for new expert boxes</div>
            </div>

            <div class="field">
              <label>Result source</label>
              <div class="hint text-muted">Preset browser simulation. It does not analyze the image.</div>
            </div>

            <div class="row">
              <UiButton variant="primary" icon="bi bi-magic" :loading="isPredicting" :disabled="!imageFile" @click="runPrediction">
                Show simulated findings
              </UiButton>
            </div>

            <div class="row">
              <UiButton variant="secondary" icon="bi bi-download" :disabled="boxes.length === 0" @click="exportCsv">
                Export annotations (CSV)
              </UiButton>
            </div>

            <div class="toggles">
              <label class="toggle">
                <input type="checkbox" v-model="showExpert" />
                <span>Expert annotations</span>
              </label>
              <label class="toggle">
                <input type="checkbox" v-model="showAI" />
                <span>Simulated findings</span>
              </label>
            </div>

            <div class="callout">
              <i class="bi bi-shield-exclamation" />
              <div>
                <div class="callout-title">Research-only disclaimer</div>
                <div class="callout-text">Outputs may be incorrect. Do not use clinically.</div>
              </div>
            </div>
          </div>
        </UiCard>

        <!-- Center: viewer + canvas overlays -->
        <UiCard title="Viewer" subtitle="Draw boxes on the public research sample" class="viewer">
          <div class="viewer-inner">
            <div v-if="!imageUrl" class="empty">
              <i class="bi bi-image" />
              <div class="empty-title">No image loaded</div>
              <div class="text-muted">Load the chest X-ray sample to start</div>
            </div>

            <div
              v-else
              ref="viewer"
              class="image-wrap"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointerleave="onPointerLeave"
            >
              <img ref="img" :src="imageUrl" class="img" alt="Public chest X-ray sample for annotation demonstration" @load="syncImageMetrics" />
              <div class="demo-watermark" aria-label="Research demo. Simulated results. Not for diagnosis.">RESEARCH DEMO · SIMULATED RESULTS · NOT FOR DIAGNOSIS</div>

              <!-- Expert boxes -->
              <template v-if="showExpert">
                <div
                  v-for="box in boxes"
                  :key="box.id"
                  class="box expert"
                  :class="{ selected: selectedBoxId === box.id }"
                  :style="boxStyle(box)"
                  @pointerdown.stop="startMove(box, $event)"
                  :title="box.label"
                >
                  <div class="tag" :style="{ background: box.color }">{{ box.label }}</div>
                  <button v-if="selectedBoxId === box.id" class="del" type="button" @click.stop="deleteBox(box.id)" title="Delete">
                    <i class="bi bi-x" />
                  </button>
                </div>
              </template>

              <!-- Preset simulated finding boxes -->
              <template v-if="showAI">
                <div
                  v-for="(pred, idx) in aiPredictions"
                  :key="`ai-${idx}`"
                  class="box ai"
                  :style="aiStyle(pred)"
                  :title="`Simulated example: ${pred.class}`"
                >
                  <div class="tag" :style="{ background: colorFor(pred.class) }">
                    {{ pred.class }} · Example
                  </div>
                </div>
              </template>

              <!-- Drawing box (in-progress) -->
              <div v-if="draftBox" class="box draft" :style="boxStyle(draftBox)">
                <div class="tag" :style="{ background: draftBox.color }">{{ draftBox.label }}</div>
              </div>

              <div v-if="isPredicting" class="overlay">
                <div class="overlay-card">
                  <div class="spinner" />
                  <div>
                    <div class="overlay-title">Preparing demo results</div>
                    <div class="text-muted">Showing preset simulated findings…</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UiCard>

        <!-- Right: predictions + report -->
        <UiCard title="Demo results & Report" subtitle="Review simulated examples and export" class="panel">
          <div class="stack">
            <div class="hint text-muted" role="note">Preset findings demonstrate the interface only. They are not generated by image analysis or trained models.</div>
            <UiCard title="Simulated findings" subtitle="Preset examples, not model confidence" :padded="false">
              <div class="list-wrap">
                <div v-if="isPredicting" class="pred-list">
                  <div class="pred"><div style="display:flex; gap:10px; align-items:center"><UiSkeleton w="10px" h="10px" r="999" /><UiSkeleton w="160px" h="12px" /></div><UiSkeleton w="58px" h="24px" r="999" /></div>
                  <div class="pred"><div style="display:flex; gap:10px; align-items:center"><UiSkeleton w="10px" h="10px" r="999" /><UiSkeleton w="140px" h="12px" /></div><UiSkeleton w="58px" h="24px" r="999" /></div>
                  <div class="pred"><div style="display:flex; gap:10px; align-items:center"><UiSkeleton w="10px" h="10px" r="999" /><UiSkeleton w="150px" h="12px" /></div><UiSkeleton w="58px" h="24px" r="999" /></div>
                </div>

                <div v-else-if="aiPredictions.length === 0" class="empty-mini text-muted">
                  Show simulated findings to populate results.
                </div>
                <div v-else class="pred-list">
                  <div v-for="(pred, idx) in sortedPredictions" :key="idx" class="pred">
                    <div class="pred-left">
                      <div class="dot" :style="{ background: colorFor(pred.class) }" />
                      <div class="pred-name">{{ pred.class }}</div>
                    </div>
                    <UiBadge variant="neutral">Preset example</UiBadge>
                  </div>
                </div>
              </div>
            </UiCard>

            <UiCard title="Report" subtitle="Structured template" :padded="false">
              <div class="report-controls">
                <UiButton variant="secondary" icon="bi bi-magic" :disabled="aiPredictions.length === 0" @click="generateReport">
                  Generate demo report
                </UiButton>
                <UiButton variant="primary" icon="bi bi-file-earmark-pdf" :disabled="!reportHtml" @click="downloadPdf">
                  Download PDF
                </UiButton>
              </div>

              <div class="report" ref="reportEl">
                <div v-if="!reportHtml" class="empty-mini text-muted">
                  Generate a report after showing the simulated findings.
                </div>
                <div v-else v-html="reportHtml" />
              </div>
            </UiCard>

            <div class="hr" />

            <div class="text-muted" style="font-size: 13px; line-height: 1.45;">
              Tip: Use <span class="kbd">E</span> and <span class="kbd">A</span> to toggle overlays. Click a box to move; press <span class="kbd">Del</span> to delete.
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script>
import UiCard from "@/ui/UiCard.vue";
import UiButton from "@/ui/UiButton.vue";
import UiBadge from "@/ui/UiBadge.vue";
import UiSkeleton from "@/ui/UiSkeleton.vue";
import DemoSimulation from "@/services/demoSimulation";
import ModelService from "@/services/modelService";
import demoSampleUrl from "@/assets/cxraide-demo-sample.png";
import html2pdf from "html2pdf.js";
import { useToast } from "@/ui/useToast";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default {
  name: "DemoWorkspaceView",
  components: { UiCard, UiButton, UiBadge, UiSkeleton },
  data() {
    return {
      abnormalities: [
        "Cardiomegaly",
        "Pleural effusion",
        "Nodule/Mass",
        "Infiltration",
        "Pleural thickening",
        "Pulmonary fibrosis",
        "Consolidation",
        "Atelectasis",
        "Pneumothorax",
      ],
      selectedLabel: "Cardiomegaly",
      imageFile: null,
      imageUrl: "",
      isDraggingFile: false,

      isPredicting: false,
      aiPredictions: [],
      predictionSource: "",

      showExpert: true,
      showAI: true,

      boxes: [],
      draftBox: null,
      selectedBoxId: null,

      isDrawing: false,
      drawStart: null,

      isMoving: false,
      moveStart: null,

      imageMetrics: {
        displayW: 0,
        displayH: 0,
      },

      reportHtml: "",
    };
  },
  computed: {
    sortedPredictions() {
      return [...this.aiPredictions];
    },
  },
  mounted() {
    this.clearLegacyImageStorage();
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
    if (this.imageUrl?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(this.imageUrl);
      } catch {
        // ignore
      }
    }
  },
  methods: {
    colorFor(label) {
      return ModelService.getBoxColor(label);
    },
    triggerFile() {
      this.$refs.fileInput?.click?.();
    },
    onFileInput(e) {
      const file = e.target.files?.[0];
      if (file) this.loadFile(file);
      e.target.value = "";
    },
    onDragOver() {
      this.isDraggingFile = true;
    },
    onDragLeave() {
      this.isDraggingFile = false;
    },
    onDrop(e) {
      this.isDraggingFile = false;
      const file = e.dataTransfer?.files?.[0];
      if (file) this.loadFile(file);
    },
    loadFile(file) {
      const { addToast } = useToast();
      this.clearImage();
      this.imageFile = file;
      this.imageUrl = URL.createObjectURL(file);
      this.boxes = [];
      this.aiPredictions = [];
      this.predictionSource = "";
      this.reportHtml = "";
      this.selectedBoxId = null;

      addToast({ variant: "success", title: "Image loaded", message: file.name });
    },
    clearImage() {
      if (this.imageUrl?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(this.imageUrl);
        } catch {
          // ignore
        }
      }
      this.imageFile = null;
      this.imageUrl = "";
      this.aiPredictions = [];
      this.predictionSource = "";
      this.boxes = [];
      this.draftBox = null;
      this.selectedBoxId = null;
      this.reportHtml = "";
    },
    clearLegacyImageStorage() {
      try {
        localStorage.removeItem("cxraide_last_image");
        localStorage.removeItem("cxraide_last_image_name");
      } catch {
        // Browser storage may be disabled; the demo still works in memory.
      }
    },
    async loadDemoSample() {
      const { addToast } = useToast();
      const response = await fetch(demoSampleUrl);
      if (!response.ok) throw new Error("Could not load the demo sample image.");
      const blob = await response.blob();
      const file = new File([blob], "cxraide-demo-sample.png", { type: "image/png" });
      await this.loadFile(file);
      addToast({ variant: "info", title: "Sample loaded", message: "Public research image; simulated results only" });
    },

    syncImageMetrics() {
      const img = this.$refs.img;
      if (!img) return;
      this.imageMetrics.displayW = img.clientWidth;
      this.imageMetrics.displayH = img.clientHeight;
    },

    getLocalPoint(evt) {
      const wrap = this.$refs.viewer;
      if (!wrap) return { x: 0, y: 0 };
      const rect = wrap.getBoundingClientRect();
      const x = clamp(evt.clientX - rect.left, 0, rect.width);
      const y = clamp(evt.clientY - rect.top, 0, rect.height);
      return { x, y };
    },

    onPointerDown(evt) {
      if (!this.imageUrl || this.isPredicting) return;
      // If click landed on an expert box, move will be handled by startMove
      if (evt.target?.classList?.contains?.("expert")) return;

      this.syncImageMetrics();
      const p = this.getLocalPoint(evt);
      this.isDrawing = true;
      this.drawStart = p;

      this.selectedBoxId = null;
      this.draftBox = {
        id: "draft",
        x: p.x,
        y: p.y,
        w: 0,
        h: 0,
        label: this.selectedLabel,
        color: this.colorFor(this.selectedLabel),
      };
      evt.currentTarget?.setPointerCapture?.(evt.pointerId);
    },

    onPointerMove(evt) {
      if (!this.imageUrl) return;
      if (this.isMoving) {
        this.moveBox(evt);
        return;
      }
      if (!this.isDrawing || !this.drawStart || !this.draftBox) return;

      const p = this.getLocalPoint(evt);
      const x1 = this.drawStart.x;
      const y1 = this.drawStart.y;
      const x2 = p.x;
      const y2 = p.y;

      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);

      this.draftBox = { ...this.draftBox, x: left, y: top, w, h };
    },

    onPointerUp() {
      if (this.isMoving) {
        this.isMoving = false;
        this.moveStart = null;
        return;
      }

      if (!this.isDrawing) return;
      this.isDrawing = false;

      if (!this.draftBox || this.draftBox.w < 6 || this.draftBox.h < 6) {
        this.draftBox = null;
        return;
      }

      const id = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
      this.boxes.push({
        id,
        x: this.draftBox.x,
        y: this.draftBox.y,
        w: this.draftBox.w,
        h: this.draftBox.h,
        label: this.draftBox.label,
        color: this.draftBox.color,
      });
      this.selectedBoxId = id;
      this.draftBox = null;

      const { addToast } = useToast();
      addToast({ variant: "success", title: "Annotation added", message: this.selectedLabel });
    },

    onPointerLeave() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.draftBox = null;
      }
      if (this.isMoving) {
        this.isMoving = false;
        this.moveStart = null;
      }
    },

    startMove(box, evt) {
      if (this.isPredicting) return;
      this.selectedBoxId = box.id;
      this.isMoving = true;
      const p = this.getLocalPoint(evt);
      this.moveStart = { id: box.id, startX: p.x, startY: p.y, boxX: box.x, boxY: box.y };
      evt.currentTarget?.setPointerCapture?.(evt.pointerId);
    },

    moveBox(evt) {
      if (!this.moveStart) return;
      const p = this.getLocalPoint(evt);
      const dx = p.x - this.moveStart.startX;
      const dy = p.y - this.moveStart.startY;
      const idx = this.boxes.findIndex((b) => b.id === this.moveStart.id);
      if (idx < 0) return;

      const wrap = this.$refs.viewer;
      const rect = wrap.getBoundingClientRect();

      const nextX = clamp(this.moveStart.boxX + dx, 0, rect.width - this.boxes[idx].w);
      const nextY = clamp(this.moveStart.boxY + dy, 0, rect.height - this.boxes[idx].h);

      this.boxes[idx] = { ...this.boxes[idx], x: nextX, y: nextY };
    },

    deleteBox(id) {
      const idx = this.boxes.findIndex((b) => b.id === id);
      if (idx >= 0) this.boxes.splice(idx, 1);
      if (this.selectedBoxId === id) this.selectedBoxId = null;
    },

    boxStyle(box) {
      return {
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.w}px`,
        height: `${box.h}px`,
        borderColor: box.color,
        backgroundColor: box === this.draftBox ? `${box.color}22` : `${box.color}14`,
      };
    },

    aiStyle(pred) {
      // Demo scenario boxes use the fixed 512x512 reference coordinate space.
      const w = this.imageMetrics.displayW || this.$refs.img?.clientWidth || 1;
      const h = this.imageMetrics.displayH || this.$refs.img?.clientHeight || 1;
      const sx = w / 512;
      const sy = h / 512;
      const [x1, y1, x2, y2] = pred.box || [0, 0, 0, 0];
      const left = x1 * sx;
      const top = y1 * sy;
      const width = Math.max(1, (x2 - x1) * sx);
      const height = Math.max(1, (y2 - y1) * sy);
      const color = this.colorFor(pred.class);
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderColor: color,
        backgroundColor: `${color}0f`,
      };
    },

    async runPrediction() {
      const { addToast } = useToast();
      if (!this.imageFile) return;
      this.isPredicting = true;
      this.aiPredictions = [];
      this.predictionSource = "";
      this.reportHtml = "";

      try {
        const res = DemoSimulation.createDemoPredictions();
        this.aiPredictions = res.predictions || [];
        this.predictionSource = res.source;
        addToast({ variant: "info", title: "Demo simulation complete", message: `${this.aiPredictions.length} preset findings shown` });
      } catch (e) {
        addToast({ variant: "danger", title: "Demo simulation failed", message: e?.message || "Unable to show demo results" });
      } finally {
        this.isPredicting = false;
      }
    },

    exportCsv() {
      const { addToast } = useToast();
      if (this.boxes.length === 0) return;

      const name = this.imageFile?.name || "image";
      const rows = [
        ["image", "label", "x", "y", "width", "height"],
        ...this.boxes.map((b) => [name, b.label, Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h)]),
      ];
      const csv = rows.map((r) => r.map((v) => String(v).replaceAll('"', '""')).map((v) => `"${v}"`).join(",")).join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cxraide_annotations_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      addToast({ variant: "success", title: "Exported", message: "CSV downloaded" });
    },

    generateReport() {
      const { addToast } = useToast();
      if (this.aiPredictions.length === 0) return;

      const top = this.sortedPredictions.slice(0, 6);
      const findings = top.length
        ? top.map((p) => p.class).join(", ")
        : "No preset findings for this demo scenario.";

      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      const time = now.toTimeString().slice(0, 8);

      this.reportHtml = `
        <div style="font-family: var(--font); color: var(--text);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
            <div>
              <div style="font-weight:900; font-size:16px; letter-spacing:0.04em; text-transform:uppercase; color: var(--text);">Demo Annotation Report</div>
              <div style="margin-top:4px; color: var(--muted); font-size:13px;">CXRaide 2.0 • Research demo</div>
            </div>
            <div style="text-align:right; color: var(--muted); font-size:12.5px;">
              <div>${date} ${time}</div>
              <div>Result source: ${this.predictionSource === "browser-simulation" ? "Browser simulation" : "Unverified"}</div>
            </div>
          </div>
          <hr style="border:0; height:1px; background: var(--border); margin:12px 0;" />

          <div style="display:grid; grid-template-columns: 1fr; gap:10px;">
            <div>
              <div style="font-weight:800; margin-bottom:4px;">Demo scenario</div>
              <div style="color: var(--text-2);">Public research sample for annotation demonstration. Preset results are simulated and are not based on image analysis.</div>
              <div style="color: var(--muted); font-size:12px; margin-top:5px;">Project training/validation sources: <a href="https://www.kaggle.com/datasets/huthayfahodeb/nih-chest-x-rays-bbox-version" target="_blank" rel="noopener noreferrer">NIH Chest X-rays Bbox</a> · <a href="https://www.kaggle.com/c/vinbigdata-chest-xray-abnormalities-detection" target="_blank" rel="noopener noreferrer">VinBigData</a>. NIH Clinical Center provided the NIH data; see the <a href="https://nihcc.app.box.com/v/ChestXray-NIHCC" target="_blank" rel="noopener noreferrer">NIH source</a> and <a href="https://openaccess.thecvf.com/content_cvpr_2017/papers/Wang_ChestX-ray8_Hospital-Scale_Chest_CVPR_2017_paper.pdf" target="_blank" rel="noopener noreferrer">Wang et al., CVPR 2017</a>.</div>
            </div>
            <div>
              <div style="font-weight:800; margin-bottom:4px;">Findings</div>
              <div style="color: var(--text-2); line-height:1.55;">Preset simulated examples: ${findings}</div>
              <div style="color: var(--muted); font-size:12.5px; margin-top:6px;">Expert boxes: ${this.boxes.length}</div>
            </div>
            <div>
              <div style="font-weight:800; margin-bottom:4px;">Impression</div>
              <div style="color: var(--text-2); line-height:1.55;">
                These preset findings are not generated by a trained model and are not based on image analysis.
              </div>
            </div>
            <div style="padding:10px 12px; border-radius:14px; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.18); color: var(--text-2);">
              <strong>Disclaimer:</strong> Not for clinical diagnosis.
            </div>
          </div>
        </div>
      `;

      addToast({ variant: "success", title: "Demo report generated", message: "Ready to export as PDF" });
    },

    async downloadPdf() {
      const { addToast } = useToast();
      const el = this.$refs.reportEl;
      if (!el) return;

      try {
        const options = {
          margin: 10,
          filename: `CXRaide_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        await html2pdf().from(el).set(options).save();
        addToast({ variant: "success", title: "Downloaded", message: "PDF report saved" });
      } catch (e) {
        addToast({ variant: "danger", title: "PDF failed", message: e?.message || "Unable to generate PDF" });
      }
    },

    onKeyDown(e) {
      if (e.key === "e" || e.key === "E") this.showExpert = !this.showExpert;
      if (e.key === "a" || e.key === "A") this.showAI = !this.showAI;
      if (e.key === "Delete" && this.selectedBoxId) this.deleteBox(this.selectedBoxId);
    },

    async dataUrlToFile(dataUrl, name) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], name, { type: blob.type || "image/png" });
    },
  },
};
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.page-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
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

.subtitle {
  color: var(--text-2);
  font-size: 13px;
  white-space: nowrap;
}

@media (max-width: 980px) {
  .page-head { flex-direction: column; align-items: flex-start; }
  .subtitle { white-space: normal; }
}

.subtitle { margin-left: 6px; font-size: 11.5px; color: var(--muted); font-weight: 600; }

.grid {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 320px;
  gap: 10px;
  align-items: start;
}

@media (max-width: 1180px) {
  .grid { grid-template-columns: 1fr; }
}

.panel { position: sticky; top: 58px; }
@media (max-width: 1180px) { .panel { position: static; } }

.stack { display: grid; gap: 8px; }

.drop {
  border: 1px dashed rgba(37,99,235,0.45);
  background: radial-gradient(700px 120px at 20% 0%, rgba(37,99,235,0.08), transparent 60%), var(--surface);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}

.drop.dragging { background: rgba(37,99,235,0.10); box-shadow: var(--ring); }
.drop-title { font-weight: 800; display: flex; gap: 6px; align-items: center; color: var(--text); font-size: 12px; }
.drop-sub { margin-top: 2px; font-size: 11.5px; }

.hidden { display: none; }

.row { display: flex; gap: 6px; flex-wrap: wrap; }

.field label { display: block; font-size: 11px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
.field select {
  width: 100%;
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.hint { margin-top: 4px; font-size: 11px; }

.toggles {
  display: grid;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.toggle { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; color: var(--text-2); }
.toggle input { width: 13px; height: 13px; }

.callout {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 7px;
  align-items: start;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(220,38,38,0.18);
  background: rgba(220,38,38,0.06);
  color: var(--text-2);
}

.callout-title { font-weight: 900; margin-bottom: 2px; color: var(--text); }
.callout-text { font-size: 11.5px; color: var(--text-2); }

.viewer { min-height: 500px; }
.viewer-inner { padding: 6px; }

.empty {
  height: 480px;
  border-radius: 8px;
  border: 1px dashed var(--border);
  background: var(--surface);
  display: grid;
  place-items: center;
  color: var(--muted);
  gap: 4px;
}

.empty i { font-size: 22px; color: rgba(37,99,235,0.55); }
.empty-title { font-weight: 900; color: var(--text); }

.image-wrap {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #0b1220;
  touch-action: none;
}

.img { display: block; width: 100%; height: auto; user-select: none; }

.demo-watermark {
  position: absolute;
  inset: 45% 4% auto;
  transform: rotate(-18deg);
  color: rgba(255,255,255,0.62);
  background: rgba(15,23,42,0.22);
  border-block: 2px solid rgba(255,255,255,0.28);
  padding: 7px 4px;
  text-align: center;
  font-size: clamp(11px, 2.2vw, 22px);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  pointer-events: none;
  z-index: 2;
}

.box {
  position: absolute;
  border: 2px solid;
  border-radius: 6px;
}

.box.expert.selected { outline: none; box-shadow: var(--ring); }
.box.ai { border-style: dashed; }
.box.draft { border-style: solid; }

.tag {
  position: absolute;
  left: 6px;
  top: -10px;
  padding: 2px 6px;
  border-radius: 999px;
  color: #fff;
  font-size: 10.5px;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
}

.del {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--text);
}

.del:hover { background: var(--surface-2); }

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(2,6,23,0.45);
  display: grid;
  place-items: center;
}

.overlay-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  padding: 9px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.overlay-title { font-weight: 900; color: var(--text); }

.spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 3px solid rgba(37,99,235,0.22);
  border-top-color: rgba(37,99,235,0.95);
  animation: spin 0.9s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.list-wrap { padding: 9px 10px; }
.empty-mini { padding: 6px 0; }

.pred-list { display: grid; gap: 6px; }
.pred {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.pred-left { display: flex; align-items: center; gap: 6px; }
.dot { width: 7px; height: 7px; border-radius: 999px; }
.pred-name { font-weight: 800; color: var(--text); }

.report-controls {
  padding: 9px 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}

.report { padding: 9px 10px; }
</style>
