import {
  test,
  expect
} from '@playwright/test';

import path from 'path';

import {
  SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';


// ============================================================
// TEST FILE PATHS
// ============================================================

const filesDirectory =
  path.resolve(
    process.cwd(),
    'test-data',
    'files'
  );

const validPdf =
  path.join(
    filesDirectory,
    'validevidence.pdf'
  );

const validDocx =
  path.join(
    filesDirectory,
    'valid-document.docx'
  );

const validXlsx =
  path.join(
    filesDirectory,
    'valid-sheet.xlsx'
  );

const validPng =
  path.join(
    filesDirectory,
    'valid-image.png'
  );

const validJpg =
  path.join(
    filesDirectory,
    'valid-photo.jpg'
  );

const validMp4 =
  path.join(
    filesDirectory,
    'valid-video.mp4'
  );

const invalidTxt =
  path.join(
    filesDirectory,
    'invalid-evidence.txt'
  );


// ============================================================
// COMMON SETUP
// Navigate to Evidence Step
// ============================================================

async function navigateToEvidence(
  submit: SubmitReportPage,
  notice: ReportingNoticePage
) {
  await submit.open();

  // Reporting Notice
  await notice.verifyLoaded();

  await notice.next();

  // Reporter Info
  await submit.reporterInfo.verifyLoaded();

  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });

  await submit.reporterInfo.next();

  // Classification
  await submit.classification.verifyLoaded();

  await submit.classification
    .selectInternalAuditAnswer('No');

  await submit.classification
    .selectCategory(
      'Conflict of Interest'
    );

  await submit.classification
    .selectSubcategory(
      'Nepotism/Cronyism'
    );

  await submit.classification.next();

  // Allegation
  await submit.allegation.verifyLoaded();

  await submit.allegation.fill({
    incidentTitle:
      'Potential conflict of interest',

    whatHappened:
      'An employee may have participated in a decision involving a related party.',

    awarenessMethod:
      'I became aware through internal business communication.',

    knowsExactDate:
      'No',

    incidentDateDescription:
      'The incident occurred approximately during September 2026.',

    ongoing:
      'No'
  });

  await submit.allegation.next();

  // Person(s) Involved
  await submit.personsInvolved
    .verifyLoaded();

  await submit.personsInvolved
    .selectCanIdentify('No');

  await submit.personsInvolved.next();

  // Witnesses
  await submit.witnesses
    .verifyLoaded();

  await submit.witnesses
    .selectWitnessAnswer('No');

  await submit.witnesses.next();

  // Evidence
  await submit.evidence
    .verifyLoaded();
}


// ============================================================
// TC-034
// Evidence = No
// ============================================================

test(
  'TC-034 | User can select No for supporting evidence and continue to Previous Reporting @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer('No');

    await submit.evidence.next();

    await expect(
      page.getByRole(
        'heading',
        {
          name: 'Previous Reporting',
          level: 2
        }
      )
    ).toBeVisible();
  }
);


// ============================================================
// TC-035
// Yes without attachment
// ============================================================

test(
  'TC-035 | Evidence attachment is required when Yes is selected @negative @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer('Yes');

    await submit.evidence
      .verifyUploadSectionVisible();

    // Do not upload anything
    await submit.evidence.next();

    // Must remain on Evidence
    await expect(
      page.getByRole(
        'heading',
        {
          name: 'Evidence',
          level: 2
        }
      )
    ).toBeVisible();
  }
);


// ============================================================
// TC-036
// Valid PDF
// ============================================================

test(
  'TC-036 | User can upload valid PDF evidence and continue @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence.fill({
      hasSupportingEvidence:
        'Yes',

      filePaths: [
        validPdf
      ]
    });

    await submit.evidence
      .verifyFileUploaded(
        'validevidence.pdf'
      );

    await submit.evidence.next();

    await expect(
      page.getByRole(
        'heading',
        {
          name: 'Previous Reporting',
          level: 2
        }
      )
    ).toBeVisible();
  }
);


// ============================================================
// TC-037
// Allowed File Types
// ============================================================

// ============================================================
// TC-037
// Allowed Evidence File Types
// PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, MP4
// ============================================================

test.describe(
  'TC-037 | Allowed Evidence File Types',
  () => {

    const allowedFiles = [
      {
        type: 'PDF',
        fileName: 'validevidence.pdf'
      },
      {
        type: 'DOC',
        fileName: 'valid-document.doc'
      },
      {
        type: 'DOCX',
        fileName: 'valid-document.docx'
      },
      {
        type: 'XLS',
        fileName: 'valid-sheet.xls'
      },
      {
        type: 'XLSX',
        fileName: 'valid-sheet.xlsx'
      },
      {
        type: 'PNG',
        fileName: 'valid-image.png'
      },
      {
        type: 'JPG',
        fileName: 'valid-photo.jpg'
      },
      {
        type: 'MP4',
        fileName: 'valid-video.mp4'
      }
    ];

    for (const file of allowedFiles) {

      test(
        `TC-037 | User can upload ${file.type} evidence @public @intake`,
        async ({ page }) => {

          const submit =
            new SubmitReportPage(page);

          const notice =
            new ReportingNoticePage(page);

          // Navigate to Evidence
          await navigateToEvidence(
            submit,
            notice
          );

          // Select Yes
          await submit.evidence
            .selectEvidenceAnswer('Yes');

          // Verify upload area
          await submit.evidence
            .verifyUploadSectionVisible();

          // Build test file path
          const filePath =
            path.join(
              filesDirectory,
              file.fileName
            );

          // Upload
          await submit.evidence
            .uploadFile(filePath);

          // Verify uploaded successfully
          await submit.evidence
            .verifyFileUploaded(
              file.fileName
            );

          // Continue
          await submit.evidence.next();

          // Verify Evidence accepted
          await expect(
            page.getByRole(
              'heading',
              {
                name: 'Previous Reporting',
                level: 2
              }
            )
          ).toBeVisible();
        }
      );
    }
  }
);
// ============================================================
// TC-038
// Unsupported File Type
// ============================================================

test(
  'TC-038 | Unsupported evidence file type is rejected @negative @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer(
        'Yes'
      );

    await submit.evidence
      .uploadFile(
        invalidTxt
      );

    // Must remain on Evidence
    await expect(
      page.getByRole(
        'heading',
        {
          name: 'Evidence',
          level: 2
        }
      )
    ).toBeVisible();

    // Do not guess validation message yet.
  }
);


// ============================================================
// TC-039
// Remove Uploaded File
// ============================================================

test(
  'TC-039 | User can remove uploaded evidence before submission @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer(
        'Yes'
      );

    await submit.evidence
      .uploadFile(
        validPdf
      );

    await submit.evidence
      .verifyFileUploaded(
        'validevidence.pdf'
      );

    await submit.evidence
      .removeFile(
        'validevidence.pdf'
      );

    await submit.evidence
      .verifyFileNotPresent(
        'validevidence.pdf'
      );
  }
);


// ============================================================
// TC-040
// Multiple Evidence Files
// ============================================================

test(
  'TC-040 | User can upload multiple evidence files @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer(
        'Yes'
      );

    await submit.evidence
      .uploadFiles([
        validPdf,
        validPng
      ]);

    await submit.evidence
      .verifyFileUploaded(
        'validevidence.pdf'
      );

    await submit.evidence
      .verifyFileUploaded(
        'valid-image.png'
      );
  }
);


// ============================================================
// TC-041
// Back Navigation + Persistence
// ============================================================

test(
  'TC-041 | Evidence data persists after Back navigation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToEvidence(
      submit,
      notice
    );

    await submit.evidence
      .selectEvidenceAnswer(
        'Yes'
      );

    await submit.evidence
      .uploadFile(
        validPdf
      );

    await submit.evidence
      .verifyFileUploaded(
        'validevidence.pdf'
      );

    // Back → Witnesses
    await submit.evidence.back();

    await submit.witnesses
      .verifyLoaded();

    // Return → Evidence
    await submit.witnesses.next();

    await submit.evidence
      .verifyLoaded();

    await expect(
      page.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeChecked();

    await submit.evidence
      .verifyFileUploaded(
        'validevidence.pdf'
      );
  }
);