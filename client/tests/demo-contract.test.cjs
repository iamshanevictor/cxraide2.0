// Dependency-free characterization of the current Vue script and model service.
// The small VM harness replaces imports only; it does not alter application code.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const quietConsole = { log() {}, warn() {}, error() {} };

function loadScript(file, globals = {}) {
  let source = fs.readFileSync(path.join(root, file), "utf8");
  if (file.endsWith(".vue")) {
    source = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(source, "Vue component must have a plain script block");
  }
  source = source.replace(/^import .*;\s*$/gm, "");
  source = source.replace(/export default (instance|\{)/, "globalThis.result = $1");
  const context = vm.createContext({ console: quietConsole, ...globals });
  vm.runInContext(source, context, { filename: file });
  return context.result;
}

function demoHarness() {
  const saved = new Map();
  const storageWrites = [];
  const downloads = [];
  const pdfExports = [];
  const predictionRequests = [];
  const simulationResults = loadScript("src/services/demoSimulation.js");
  let simulationCalls = 0;
  let objectNumber = 0;
  const urls = new Map();
  const URL = {
    createObjectURL(value) {
      const url = `blob:synthetic-${++objectNumber}`;
      urls.set(url, value);
      return url;
    },
    revokeObjectURL() {},
  };
  const document = {
    body: { appendChild() {} },
    createElement(name) {
      if (name === "canvas") {
        return {
          getContext() {
            return { fillRect() {}, createRadialGradient() { return { addColorStop() {} }; } };
          },
          toDataURL() { return "data:image/png;base64,c3ludGhldGlj"; },
        };
      }
      assert.equal(name, "a");
      return { click() { downloads.push(this); }, remove() {} };
    },
  };
  const localStorage = {
    getItem(key) { return saved.get(key) ?? null; },
    setItem(key, value) { storageWrites.push([key, value]); saved.set(key, value); },
    removeItem(key) { saved.delete(key); },
  };
  const component = loadScript("src/views/DemoWorkspaceView.vue", {
    UiCard: {}, UiButton: {}, UiBadge: {}, UiTooltip: {}, UiSkeleton: {},
    DemoSimulation: {
      createDemoPredictions() {
        simulationCalls += 1;
        return simulationResults.createDemoPredictions();
      },
    },
    demoSampleUrl: "/assets/cxraide-demo-sample.png",
    fetch: async (url) => ({
      ok: true,
      async blob() { return new Blob([url], { type: "image/png" }); },
    }),
    File: class TestFile extends Blob {
      constructor(parts, name, options) { super(parts, options); this.name = name; }
    },
    ModelService: {
      getBoxColor: () => "#123456",
      async predict(file, options) {
        predictionRequests.push({ file, options });
        return { predictions: [{ class: "Cardiomegaly", score: 0.82, box: [1, 2, 10, 20] }] };
      },
    },
    html2pdf: () => ({ from(element) { this.element = element; return this; }, set(options) { this.options = options; return this; }, async save() { pdfExports.push({ element: this.element, options: this.options }); } }),
    useToast: () => ({ addToast() {} }),
    URL, document, localStorage, Blob, Date,
    window: { addEventListener() {} },
    crypto: { randomUUID: () => "synthetic-box" },
  });
  const view = Object.assign(component.data(), component.methods);
  view.$refs = {
    img: { clientWidth: 200, clientHeight: 100 },
    viewer: { getBoundingClientRect: () => ({ left: 10, top: 20, width: 200, height: 100 }) },
  };
  Object.defineProperty(view, "sortedPredictions", {
    get() { return component.computed.sortedPredictions.call(view); },
  });
  return { component, view, saved, storageWrites, downloads, urls, pdfExports, predictionRequests, simulationResults, get simulationCalls() { return simulationCalls; } };
}

test("public demo exposes the research sample with visible simulation and diagnosis warnings", () => {
  const source = fs.readFileSync(path.join(root, "src/views/DemoWorkspaceView.vue"), "utf8");
  const template = source.match(/<template>([\s\S]*?)<\/template>/)?.[1];
  assert.ok(template);
  assert.match(template, /Load chest X-ray sample/);
  assert.match(template, /does not analyze the image/);
  assert.match(template, /RESEARCH DEMO · SIMULATED RESULTS · NOT FOR DIAGNOSIS/);
  assert.match(source, /Preset findings demonstrate the interface only/);
  assert.match(source, /NIH Chest X-rays Bbox/);
  assert.match(source, /VinBigData/);
  assert.match(source, /Show simulated findings/);
  assert.doesNotMatch(template, /type="file"|@drop|@dragover|@click="triggerFile"/);
  assert.doesNotMatch(template, /CXR-IT2|CXR-IT3|AI model|confidence scores/);
  assert.doesNotMatch(source, /ModelService\.predict/);
});

test("demo simulation fixture is repeatable, private, and uses valid 512px boxes", () => {
  const simulation = loadScript("src/services/demoSimulation.js");
  const first = simulation.createDemoPredictions();
  const second = simulation.createDemoPredictions();

  assert.deepEqual(first, second);
  assert.notStrictEqual(first.predictions, second.predictions);
  assert.equal(first.source, "browser-simulation");
  assert.equal(first.scenario, "public-cxr-sample");
  assert.equal(first.predictions.length, 2);
  for (const prediction of first.predictions) {
    assert.equal(prediction.source, "browser-simulation");
    assert.equal(Object.hasOwn(prediction, "score"), false);
    const [x1, y1, x2, y2] = prediction.box;
    assert.ok(x1 >= 0 && y1 >= 0 && x2 <= 512 && y2 <= 512);
    assert.ok(x2 > x1 && y2 > y1);
  }
});

test("public sample still enters annotation and repeatable browser simulation without API calls", async () => {
  const harness = demoHarness();
  const { view, predictionRequests, simulationResults } = harness;
  view.dataUrlToFile = async (_, name) => ({ name, type: "image/png" });
  await view.loadDemoSample();
  assert.equal(view.imageFile.name, "cxraide-demo-sample.png");
  assert.equal(view.imageUrl.startsWith("blob:"), true);

  view.onPointerDown({ clientX: 30, clientY: 40, pointerId: 1, target: {}, currentTarget: {} });
  view.onPointerMove({ clientX: 72, clientY: 67 });
  view.onPointerUp();
  assert.equal(view.boxes.length, 1);

  await view.runPrediction();
  assert.equal(predictionRequests.length, 0);
  assert.equal(harness.simulationCalls, 1);
  assert.equal(view.predictionSource, "browser-simulation");
  assert.deepEqual(view.aiPredictions, simulationResults.createDemoPredictions().predictions);
  view.generateReport();
  assert.match(view.reportHtml, /Browser simulation/);
  assert.match(view.reportHtml, /Preset simulated examples/);
  assert.match(view.reportHtml, /not based on image analysis/i);
  assert.doesNotMatch(view.reportHtml, /IT2|IT3|confidence|AI-assisted interpretation/i);
});

test("demo clears legacy image storage and keeps new images only in memory", () => {
  const { component, view, saved, storageWrites } = demoHarness();
  saved.set("cxraide_last_image", "data:image/png;base64,c3ludGhldGlj");
  saved.set("cxraide_last_image_name", "old-synthetic.png");
  saved.set("authToken", "synthetic-token");
  component.mounted.call(view);
  assert.equal(saved.has("cxraide_last_image"), false);
  assert.equal(saved.has("cxraide_last_image_name"), false);
  assert.equal(saved.get("authToken"), "synthetic-token");
  assert.equal(view.imageFile, null);

  const file = { name: "synthetic.png" };
  view.loadFile(file);
  assert.equal(view.imageFile, file);
  assert.equal(view.imageUrl.startsWith("blob:"), true);
  assert.deepEqual(storageWrites, []);

  const reopened = Object.assign(component.data(), component.methods);
  component.mounted.call(reopened);
  assert.equal(reopened.imageFile, null);
  assert.equal(reopened.imageUrl, "");
  view.clearImage();
  assert.equal(view.imageFile, null);
  assert.deepEqual(storageWrites, []);
});

test("manual boxes use display pixels and CSV exports only those boxes", async () => {
  const { view, downloads, urls } = demoHarness();
  view.imageUrl = "blob:synthetic-image";
  view.imageFile = { name: 'synthetic,"sample.png' };
  const event = (x, y) => ({ clientX: x, clientY: y, pointerId: 1, target: {}, currentTarget: {} });
  view.onPointerDown(event(30, 40));
  view.onPointerMove(event(72.4, 66.6));
  view.onPointerUp();
  assert.equal(view.boxes[0].x, 20);
  assert.equal(view.boxes[0].y, 20);
  assert.ok(Math.abs(view.boxes[0].w - 42.4) < 0.001);
  assert.ok(Math.abs(view.boxes[0].h - 26.6) < 0.001);
  view.aiPredictions = [{ class: "Nodule/Mass", score: 0.9, box: [0, 0, 50, 50] }];
  view.exportCsv();
  assert.equal(downloads.length, 1);
  const csv = await urls.get(downloads[0].href).text();
  assert.equal(csv, '"image","label","x","y","width","height"\n"synthetic,""sample.png","Cardiomegaly","20","20","42","27"');
  assert.equal(csv.includes("Nodule/Mass"), false);
});

test("demo report labels simulated output and PDF export uses generated HTML", async () => {
  const { view, pdfExports } = demoHarness();
  view.aiPredictions = [{ class: "Cardiomegaly", source: "browser-simulation", box: [1, 2, 3, 4] }];
  view.predictionSource = "browser-simulation";
  view.boxes = [{ id: "synthetic-box" }];
  view.generateReport();
  assert.match(view.reportHtml, /Cardiomegaly/);
  assert.match(view.reportHtml, /Expert boxes: 1/);
  assert.match(view.reportHtml, /Research demo/);
  assert.match(view.reportHtml, /Result source: Browser simulation/);
  assert.match(view.reportHtml, /not generated by a trained model/i);
  assert.doesNotMatch(view.reportHtml, /\d+%/);
  assert.match(view.reportHtml, /Not for clinical diagnosis/);
  view.$refs.reportEl = { innerHTML: view.reportHtml };
  await view.downloadPdf();
  assert.equal(pdfExports.length, 1);
  assert.equal(pdfExports[0].element, view.$refs.reportEl);
  assert.equal(pdfExports[0].options.jsPDF.format, "a4");
});

function serviceHarness(fetchImpl) {
  const storage = { getItem: () => null };
  const service = loadScript("src/services/modelService.js", {
    apiUrl: "https://api.invalid",
    window: { addEventListener() {} },
    localStorage: storage,
    AbortController, FormData, fetch: fetchImpl,
  });
  service.resizeImageForModel = async () => ({ file: new Blob(["synthetic"], { type: "image/jpeg" }) });
  return service;
}

test("client posts selected model and adapts server predictions without provenance", async () => {
  let sent;
  const service = serviceHarness(async (url, options) => {
    sent = { url, options };
    return { ok: true, json: async () => ({
      predictions: [{ boxes: [1, 2, 10, 20], label: "Cardiomegaly", score: 0.7 }],
      clean_image: "data:image/png;base64,c3ludGhldGlj",
      annotated_image: "data:image/png;base64,c3ludGhldGlj",
      model_used: "cxr-it2",
    }) };
  });
  const result = await service.predict({ name: "synthetic.png" }, { model_type: "CXR-IT2" });
  assert.equal(sent.url, "https://api.invalid/api/predict");
  assert.equal(sent.options.body.get("model_type"), "CXR-IT2");
  assert.ok(sent.options.body.has("image"));
  assert.equal(result.predictions[0].class, "Cardiomegaly");
  assert.equal(Object.hasOwn(result, "model_used"), false);
  assert.equal(Object.hasOwn(result, "source"), false);
});

test("client fallback triggers for exact PyTorch error, while network errors propagate", async () => {
  const service = serviceHarness(async () => ({
    ok: false, status: 500, statusText: "error",
    json: async () => ({ error: "PyTorch is not installed on the server" }),
  }));
  service.generateMockPredictions = async () => ({ predictions: [], source: "synthetic-browser-mock" });
  assert.equal((await service.predict({ name: "synthetic.png" })).source, "synthetic-browser-mock");

  const unavailable = serviceHarness(async () => { throw new Error("Network unavailable"); });
  unavailable.generateMockPredictions = async () => { throw new Error("unexpected fallback"); };
  await assert.rejects(unavailable.predict({ name: "synthetic.png" }), /Network unavailable/);
});
