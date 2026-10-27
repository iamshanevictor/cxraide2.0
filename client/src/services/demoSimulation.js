const presetFindings = Object.freeze([
  Object.freeze({ class: "Cardiomegaly", box: Object.freeze([180, 150, 340, 300]) }),
  Object.freeze({ class: "Pleural effusion", box: Object.freeze([80, 250, 150, 400]) }),
]);

function createDemoPredictions() {
  return {
    source: "browser-simulation",
    scenario: "synthetic-illustration",
    predictions: presetFindings.map((finding) => ({
      class: finding.class,
      box: [...finding.box],
      source: "browser-simulation",
    })),
    imageSize: { width: 512, height: 512 },
  };
}

export default { createDemoPredictions };
