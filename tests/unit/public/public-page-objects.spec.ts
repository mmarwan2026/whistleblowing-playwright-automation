import { expect, test } from '@playwright/test';

import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { FollowUpAccessPage } from '../../../pages/public/follow-up/FollowUpAccessPage';
import { FollowUpCasePage } from '../../../pages/public/follow-up/FollowUpCasePage';
import { SubmissionSuccessPage } from '../../../pages/public/submit-report/SubmissionSuccessPage';
import { DeclarationStep } from '../../../pages/public/submit-report/steps/DeclarationStep';

test.describe('Public reporting Page Objects', () => {
  test('ReportingNoticePage verifies the notice and continues to the report form', async ({ page }) => {
    await page.setContent(`
      <h1>Reporting &amp; Confidentiality Notice</h1>
      <a href="/">Cancel</a>
      <button type="button" onclick="document.body.dataset.continued='true'">Confirm and continue</button>
    `);

    const notice = new ReportingNoticePage(page);

    await notice.verifyLoaded();
    await notice.next();

    await expect(page.locator('body')).toHaveAttribute('data-continued', 'true');
  });

  test('FollowUpAccessPage enters credentials and accesses the report', async ({ page }) => {
    await page.setContent(`
      <h1>Follow Up on a Previously Submitted Report</h1>
      <label>Reference Number <input aria-label="Reference Number"></label>
      <label>Access Code <input aria-label="Access Code"></label>
      <button type="button" onclick="document.body.dataset.accessed='true'">Access Report</button>
    `);

    const accessPage = new FollowUpAccessPage(page);
    const credentials = {
      referenceNumber: 'Ab12-cD34-Ef56',
      pin: '123456'
    };

    await accessPage.verifyLoaded();
    await accessPage.access(credentials);

    await expect(page.locator('input[aria-label="Reference Number"]')).toHaveValue(credentials.referenceNumber);
    await expect(page.locator('input[aria-label="Access Code"]')).toHaveValue(credentials.pin);
    await expect(page.locator('body')).toHaveAttribute('data-accessed', 'true');
  });

  test('FollowUpCasePage verifies the current report case view', async ({ page }) => {
    await page.setContent(`
      <h1>Your Report</h1>
      <p>Credentials accepted. Review the status below.</p>
      <p>Reference Number</p>
      <p>Ab12-cD34-Ef56</p>
      <p>Submitted</p>
      <button type="button">View Report</button>
      <button type="button">Mailbox</button>
      <button type="button">Attachments History</button>
      <h2>Secure Mailbox</h2>
    `);

    const casePage = new FollowUpCasePage(page);

    await casePage.expectLoaded();
    await casePage.expectReferenceNumber('Ab12-cD34-Ef56');
    await casePage.expectStatus('Submitted');
    await casePage.expectSecureMailboxVisible();
  });

  test('FollowUpCasePage verifies submitted data in the report view', async ({ page }) => {
    await page.setContent(`
      <h1>Your Report</h1>
      <p>Credentials accepted. Review the status below.</p>
      <p>Reference Number</p>
      <p>Ab12-cD34-Ef56</p>
      <p>Submitted</p>
      <button type="button" onclick="document.body.insertAdjacentHTML('beforeend', '<section id=report-view><p>Synthetic Category</p><p>Synthetic incident description</p><p>Synthetic observation</p><p>Synthetic Test Site</p><p>2026-09-01</p><p>No</p><p>Synthetic Witness</p><p>Safety Specialist</p><p>Synthetic Test Company</p></section>')">View Report</button>
      <button type="button">Mailbox</button>
      <button type="button">Attachments History</button>
      <h2>Secure Mailbox</h2>
    `);

    const casePage = new FollowUpCasePage(page);

    await casePage.expectSubmittedReport({
      reporter: {
        identityType: 'anonymous'
      },
      reportDetails: {
        category: 'Synthetic Category',
        incidentDescription: 'Synthetic incident description',
        awarenessMethod: 'Synthetic observation',
        location: 'Synthetic Test Site',
        incidentDate: '2026-09-01',
        ongoing: 'No'
      },
      personsInvolved: {
        canIdentify: 'No',
        persons: [{
          fullName: 'Synthetic Witness',
          position: 'Safety Specialist',
          company: 'Synthetic Test Company'
        }]
      },
      entitiesInvolved: { canIdentify: 'No' },
      evidence: { hasSupportingEvidence: 'No' },
      previousReporting: { previouslyReported: 'No' }
    });
  });

  test('SubmissionSuccessPage reads the generated reference number and access code', async ({ page }) => {
    await page.setContent(`
      <h1>Thank You</h1>
      <p>Your report has been submitted successfully.</p>
      <button type="button">Download Reference Number and Access Code</button>
      <p>Reference Number</p>
      <p>Ab12-cD34-Ef56</p>
      <p>Access Code</p>
      <p>123456</p>
      <button type="button">Copy Reference &amp; Access Code</button>
    `);

    const successPage = new SubmissionSuccessPage(page);

    await successPage.expectSuccess();

    await expect(await successPage.getResult()).toEqual({
      referenceNumber: 'Ab12-cD34-Ef56',
      pin: '123456'
    });
  });

  test('DeclarationStep accepts the declaration and exposes report submission', async ({ page }) => {
    await page.setContent(`
      <h2>Declaration</h2>
      <label>
        <input type="checkbox" aria-label="I have read and agree with the above and wish to submit my report.">
        I have read and agree with the above and wish to submit my report.
      </label>
      <button type="button">Back</button>
      <button type="button">Submit Report</button>
    `);

    const declaration = new DeclarationStep(page);

    await declaration.verifyLoaded();
    await declaration.acceptAcknowledgement();
    await declaration.verifyAcknowledgementChecked();
    await declaration.verifySubmitEnabled();
  });
});
