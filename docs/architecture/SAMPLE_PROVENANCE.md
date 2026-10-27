# Chest X-ray sample provenance review

Reviewed: 2026-10-27 (CX-012/013). The owner selected and approved the attached public research image for the demo and states it comes from the project's training/validation data and contains no PII. It is bundled as an annotation sample, with the owner-provided NIH and VinBigData dataset references shown in the UI. The exact originating dataset/image ID cannot be determined from the attached rendering.

## Candidate assessment

### Owner-provided attachment (CX-012)

- **Observed file:** One 474×474, 8-bit RGB PNG was supplied in the chat attachment and bundled at `client/src/assets/cxraide-demo-sample.png`. The PNG contains only IHDR, IDAT, and IEND chunks; no ancillary text/metadata chunks were present.
- **Visible content:** A chest radiograph with visible `PORTABLE`, `AP`, and `L` markers. No obvious name or date overlay is visible in the supplied rendering. This visual check cannot establish that the image is de-identified or non-identifiable; it is still patient imaging data.
- **Provenance:** The owner identifies the project’s training/validation datasets as NIH Chest X-rays Bbox and VinBigData Chest X-ray Abnormalities Detection and approved this sample for the demo. The screenshot does not preserve an image ID, so exact mapping to one source is not independently verifiable.
- **Metadata/content:** The 474×474, 8-bit RGB PNG contains only IHDR, IDAT, and IEND chunks. Visible markers are `PORTABLE`, `AP`, and `L`; no obvious name/date overlay is visible. No DICOM source metadata is present in this rendering. The owner states the sample has no PII.
- **Use:** Bundled with the owner's direction for the public research demo. The UI links both dataset pages and states that results are preset simulations, not image analysis, with a prominent non-diagnostic watermark. This records the owner's product direction, not a legal opinion.

### Owner-provided source links (2026-10-27)

| Candidate source | Source evidence | CX-012 assessment |
|---|---|---|
| [Kaggle: NIH Chest X-rays Bbox version](https://www.kaggle.com/datasets/huthayfahodeb/nih-chest-x-rays-bbox-version) | The owner identifies this as one of the project's training/validation datasets. The Kaggle page did not expose its dataset details/license to the available page reader. [Kaggle's dataset documentation](https://www.kaggle.com/docs/datasets) says the uploader selects the dataset license. [Google Cloud's NIH dataset documentation](https://docs.cloud.google.com/healthcare-api/docs/resources/public-datasets/nih-chest) says NIH images have no use restrictions but require the NIH link, Wang et al. (CVPR 2017) citation, and NIH Clinical Center acknowledgment. The attached rendering cannot be matched to an NIH image ID. | Used as a project dataset reference per owner direction; exact image-to-source mapping and Kaggle re-upload license remain unverified. |
| [Kaggle: VinBigData Chest X-ray Abnormalities Detection](https://www.kaggle.com/competitions/vinbigdata-chest-xray-abnormalities-detection) | The owner identifies this as another project training/validation dataset. The [dataset maintainer's VinDr-CXR repository](https://github.com/vinbigdata-medical/vindr-cxr) says users must accept its DUA, agree not to share the data, and may use it only for scientific research and education. The competition page describes 18,000 scans from two Vietnam hospitals. The attached rendering cannot be matched to an image ID. | Linked as a project dataset reference per owner direction. The maintainer's no-sharing terms are recorded as a constraint if the exact sample is later identified as VinBigData. |

**Candidate-source note:** The image is included on the owner's confirmation that it is a public, non-identifiable image from the datasets used in the project. The supplied rendering lacks a source ID, so it is attributed to the project's provided dataset references rather than represented as a verified record from either dataset individually.

| Source | Observed source terms and provenance | De-identification and metadata | Assessment |
|---|---|---|---|
| [NIH ChestX-ray14](https://nihcc.app.box.com/v/ChestXray-NIHCC) | Google's current [NIH dataset documentation](https://docs.cloud.google.com/healthcare-api/docs/resources/public-datasets/nih-chest) summarizes NIH image use as unrestricted with attribution: link the NIH download site, cite Wang et al. (CVPR 2017), and acknowledge NIH Clinical Center. The owner selects this as a project dataset reference. | The attached sample has no NIH image ID, so exact membership in NIH ChestX-ray14 cannot be independently established. The attached PNG has no ancillary metadata chunks and no obvious name/date overlay. | **Included per owner direction with source links.** The exact source-record match remains an unverified provenance detail. |
| [CheXpert](https://stanfordmlgroup.github.io/competitions/chexpert/) | Stanford's page describes 224,316 radiographs from 65,240 patients, collected at Stanford Hospital with associated reports, and links dataset access through Stanford AIMI. The page reviewed does not state public-demo redistribution rights. | No sample file or direct dataset terms were available for metadata or pixel inspection. The page describes data collection, not a per-file privacy guarantee. | **Unresolved alternative.** Do not publish unless the access terms explicitly allow redistribution in a public demo and a selected file passes privacy review. |
| [PadChest research-use agreement](https://bimcv.cipf.es/bimcv-projects/padchest/padchest-dataset-research-use-agreement/) | The agreement permits research use, and says distribution, publication, or reproduction of any portion requires specific prior written permission. | The agreement says images and reports were made anonymous and de-identified, and prohibits re-identification. No specific sample file was available for inspection. | **Not suitable without written permission.** Dataset-level de-identification does not override its redistribution restriction or replace file-level checks. |

## Excluded comparator

[MIMIC-CXR](https://physionet.org/content/mimic-cxr/2.0.0/) reports HIPAA Safe Harbor de-identification, but access requires credentialing, training, and a data-use agreement that prohibits sharing data. [PhysioNet's online-service guidance](https://physionet.org/news/post/llm-responsible-use/) also prohibits sending restricted data to third parties. It is unsuitable as a publicly downloadable demo sample under the reviewed terms.

## Review steps for future sample assets

1. Select a specific source and image identifier; verify current redistribution terms or obtain written permission covering public-demo use.
2. Confirm required attribution and any noncommercial, research-only, or other restrictions.
3. Obtain the source file from the authorized source and inspect its format, metadata, embedded overlays/text, and visible anatomy for identifying content. Record the tool and result; if modification is allowed and metadata is removed, re-check the resulting file.
4. Confirm repository and hosting redistribution are permitted and that the image is suitable for annotation. Keep reports and patient-linked records out of the demo.
5. Owner reviews and approves the evidence and exact asset before it is added. If a term or privacy property remains unclear, retain the current project sample or synthetic illustration.

## Limits of this review

The supplied attachment was a flattened PNG rather than its original source file, so no original DICOM or dataset identifier can be checked. The user-approved project reference datasets are linked in the application; the exact per-image source is unverified. The NIH use/attribution statement is available through Google Cloud's current dataset documentation, while the Kaggle bounding-box re-upload's own license was not available to the page reader. The VinBigData maintainer DUA says not to share data; if the exact image is later identified as VinBigData, obtain clarification/permission before distributing a copy. This technical review records the owner's direction and source evidence; it is not a legal determination.
