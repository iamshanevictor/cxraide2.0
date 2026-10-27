# Chest X-ray sample provenance review

Reviewed: 2026-10-27. This is a source review for the public research demo; no image was selected, downloaded, or added to the repository. Candidate-level statements do not establish that an individual file is safe to publish.

## Candidate assessment

| Source | Observed source terms and provenance | De-identification and metadata | Assessment |
|---|---|---|---|
| [NIH ChestX-ray14](https://nihcc.app.box.com/v/ChestXray-NIHCC) | NIH's download portal is the primary source. The [dataset paper](https://openaccess.thecvf.com/content_cvpr_2017/papers/Wang_ChestX-ray8_Hospital-Scale_Chest_CVPR_2017_paper.pdf) describes images from the NIH Clinical Center. Secondary publications describe public/CC0 availability, but the official portal terms could not be retrieved in this review. | No source file was available for file-level metadata, burned-in text, or image inspection. A dataset-level public or de-identification claim cannot prove that a particular file has no identifying content. | **Conditional first candidate; not cleared.** Proceed only after the owner verifies the original NIH redistribution terms and selects a specific image. Record attribution and inspect the original and all metadata before adding it. |
| [CheXpert](https://stanfordmlgroup.github.io/competitions/chexpert/) | Stanford's page describes 224,316 radiographs from 65,240 patients, collected at Stanford Hospital with associated reports, and links dataset access through Stanford AIMI. The page reviewed does not state public-demo redistribution rights. | No sample file or direct dataset terms were available for metadata or pixel inspection. The page describes data collection, not a per-file privacy guarantee. | **Unresolved alternative.** Do not publish unless the access terms explicitly allow redistribution in a public demo and a selected file passes privacy review. |
| [PadChest research-use agreement](https://bimcv.cipf.es/bimcv-projects/padchest/padchest-dataset-research-use-agreement/) | The agreement permits research use, and says distribution, publication, or reproduction of any portion requires specific prior written permission. | The agreement says images and reports were made anonymous and de-identified, and prohibits re-identification. No specific sample file was available for inspection. | **Not suitable without written permission.** Dataset-level de-identification does not override its redistribution restriction or replace file-level checks. |

## Excluded comparator

[MIMIC-CXR](https://physionet.org/content/mimic-cxr/2.0.0/) reports HIPAA Safe Harbor de-identification, but access requires credentialing, training, and a data-use agreement that prohibits sharing data. [PhysioNet's online-service guidance](https://physionet.org/news/post/llm-responsible-use/) also prohibits sending restricted data to third parties. It is unsuitable as a publicly downloadable demo sample under the reviewed terms.

## Owner gates before adding any asset

1. Select a specific source and image identifier; verify current redistribution terms or obtain written permission covering public-demo use.
2. Confirm required attribution and any noncommercial, research-only, or other restrictions.
3. Obtain the source file from the authorized source and inspect its format, metadata, embedded overlays/text, and visible anatomy for identifying content. Record the tool and result; if modification is allowed and metadata is removed, re-check the resulting file.
4. Confirm repository and hosting redistribution are permitted and that the image is suitable for annotation. Keep reports and patient-linked records out of the demo.
5. Owner reviews and approves the evidence and exact asset before it is added. If a term or privacy property remains unclear, retain the synthetic illustration.

## Limits of this review

No candidate image was provided or downloaded, so pixel-level visual review, metadata inspection, embedded-text screening, and checksum recording were not possible. The NIH Box portal did not expose its terms to the browsing tool; secondary license descriptions were not treated as permission. The CheXpert access page did not establish redistribution rights. This is a technical provenance review, not a legal determination.
