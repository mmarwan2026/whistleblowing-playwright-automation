import { expect, test, Page } from '@playwright/test';

import { FullIdentifiedReportData } from '../../data/e2e/FullIdentifiedReportData';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';

const allowedFiles = [
  'allowed-png.png',
  'allowed-doc.doc',
  'allowed-docx.docx',
  'allowed-gif.gif',
  'allowed-jpg.jpg',
  'allowed-jpeg.jpeg',
  'allowed-mpg.mpg',
  'allowed-mpeg.mpeg',
  'allowed-mp3.mp3',
  'allowed-pdf.pdf',
  'allowed-ppt.ppt',
  'allowed-pptx.pptx',
  'allowed-txt.txt',
  'allowed-xls.xls',
  'allowed-xlsx.xlsx',
  'allowed-wav.wav',
  'allowed-csv.csv',
  'allowed-mp4.mp4',
  'allowed-ogg.ogg',
  'allowed-webm.webm',
  'allowed-3gp.3gp',
  'allowed-mov.mov',
  'allowed-heic.heic',
  'allowed-heif.heif'
] as const;

async function openEvidenceStep(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);
  const data = FullIdentifiedReportData;

  await submit.open();
  await notice.verifyLoaded();
  await notice.next();
  await submit.reporterInfo.fill(data.reporter);
  await submit.reporterInfo.next();
  await submit.reportDetails.fill(data.reportDetails!);
  await submit.reportDetails.next();
  await submit.personsInvolved.fill(data.personsInvolved);
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.fill(data.entitiesInvolved);
  await submit.entitiesInvolved.next();
  await submit.previousReporting.fill(data.previousReporting);
  await submit.previousReporting.next();
  await submit.evidence.verifyLoaded();
  return submit;
}

test.describe('Identified Evidence File-Type Coverage - E2E', () => {
  for (const [index, fileName] of allowedFiles.entries()) {
    test(
      `E2E-020-${String(index + 1).padStart(2, '0')} | Allowed evidence file type ${fileName} @e2e @public @intake`,
      async ({ page }) => {
        const submit = await openEvidenceStep(page);
        const filePath = `test-data/files/allowed/${fileName}`;
        const description = `Synthetic allowed file description for ${fileName}.`;

        await submit.evidence.fill({
          hasSupportingEvidence: 'Yes',
          filePaths: [filePath],
          fileDescriptions: [description]
        });

        await submit.evidence.verifyFileUploaded(fileName);
        await expect(page.locator('textarea[placeholder*="Please clearly indicate"]'))
          .toHaveCount(1);
        await expect(page.locator('textarea[placeholder*="Please clearly indicate"]'))
          .toHaveValue(description);
      }
    );
  }
});
