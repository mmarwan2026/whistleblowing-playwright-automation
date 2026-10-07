import {
  test,
  expect
} from '@playwright/test';

import {
  SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';


// ============================================================
// REPORTER INFO
// ============================================================


// ============================================================
// TC-001
// Anonymous Reporter Happy Path
// ============================================================

test(
  'TC-001 | Anonymous reporter can continue to Classification @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // --------------------------------------------------------
    // Open public portal
    // --------------------------------------------------------

    await submit.open();

    // --------------------------------------------------------
    // Reporting & Confidentiality Notice
    // --------------------------------------------------------

    await notice.verifyLoaded();
    await notice.next();

    // --------------------------------------------------------
    // Reporter Info
    // --------------------------------------------------------

    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // --------------------------------------------------------
    // Classification
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-002
// Identified Reporter Happy Path
// ============================================================

test(
  'TC-002 | Identified reporter can continue to Classification @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'identified',

      firstName: 'Ahmed',
      lastName: 'Ali',

      company: 'Red Sea Global',

      department:
        'Quality Assurance',

      position:
        'QA Engineer',

      mobile:
        '0500000000',

      email:
        'qa.automation@example.com'
    });

    await submit.reporterInfo.next();

    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-003
// Reporter Category Mandatory
// ============================================================

test(
  'TC-003 | Reporter Category is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // --------------------------------------------------------
    // Open public portal
    // --------------------------------------------------------

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // --------------------------------------------------------
    // Reporter Info
    // --------------------------------------------------------

    await submit.reporterInfo.verifyLoaded();

    // Select Anonymous
    await submit.reporterInfo.selectAnonymous();

    // Reporter Category intentionally empty
    await submit.reporterInfo.next();

    // --------------------------------------------------------
    // General validation
    // --------------------------------------------------------

    await expect(
      page.getByRole('alert').filter({
        hasText:
          'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // --------------------------------------------------------
    // Reporter Category validation
    // --------------------------------------------------------

    const reporterCategory =
      page.getByRole('combobox', {
        name: 'Reporter Category'
      });

    await expect(
      reporterCategory
    ).toBeVisible();

    await expect(
      reporterCategory
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // --------------------------------------------------------
    // Must remain on Reporter Info
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-004
// Identity Selection Mandatory
// ============================================================

test(
  'TC-004 | Identity selection is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    // --------------------------------------------------------
    // Identity intentionally NOT selected
    // Reporter Category intentionally NOT selected
    // --------------------------------------------------------

    await submit.reporterInfo.next();

    // --------------------------------------------------------
    // Validation alert
    // --------------------------------------------------------

    await expect(
      page.getByRole('alert').filter({
        hasText:
          'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // --------------------------------------------------------
    // Neither identity option should be selected
    // --------------------------------------------------------

    await expect(
      page.getByRole('radio', {
        name: 'Disclose my identity'
      })
    ).not.toBeChecked();

    await expect(
      page.getByRole('radio', {
        name: 'Remain anonymous'
      })
    ).not.toBeChecked();

    // --------------------------------------------------------
    // Remain on Reporter Info
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-005
// Back Button
// ============================================================

test(
  'TC-005 | Back button is disabled on Reporter Info first step @regression @navigation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    // --------------------------------------------------------
    // Back button
    // --------------------------------------------------------

    const backButton =
      page.getByRole('button', {
        name: 'Back'
      });

    await expect(
      backButton
    ).toBeVisible();

    await expect(
      backButton
    ).toBeDisabled();

    // --------------------------------------------------------
    // Still Reporter Info
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-006
// Quick Exit
// ============================================================

test(
  'TC-006 | Quick Exit is available on Reporter Info @regression @security @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    // --------------------------------------------------------
    // Quick Exit
    // --------------------------------------------------------

    const quickExit =
      page.getByRole('button', {
        name: 'QUICK EXIT (ESC)'
      });

    await expect(
      quickExit
    ).toBeVisible();

    await expect(
      quickExit
    ).toBeEnabled();

    // --------------------------------------------------------
    // Still Reporter Info
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-007
// Identified Reporter Mandatory Fields Discovery
// ============================================================

test(
  'TC-007 | Identified reporter mandatory fields discovery @regression @validation @diagnostic',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    // --------------------------------------------------------
    // Select Identified
    // --------------------------------------------------------

    await submit.reporterInfo.selectIdentified();

    // --------------------------------------------------------
    // Leave identified reporter fields empty
    // --------------------------------------------------------

    await submit.reporterInfo.next();

    // --------------------------------------------------------
    // General validation
    // --------------------------------------------------------

    await expect(
      page.getByRole('alert').filter({
        hasText:
          'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // --------------------------------------------------------
    // Must remain on Reporter Info
    // --------------------------------------------------------

    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();

    // --------------------------------------------------------
    // Find invalid fields
    // --------------------------------------------------------

    const invalidFields =
      page.locator(
        '[aria-invalid="true"]'
      );

    const count =
      await invalidFields.count();

    console.log(
      `\nIdentified mandatory field candidates: ${count}`
    );

    for (
      let index = 0;
      index < count;
      index++
    ) {

      const field =
        invalidFields.nth(index);

      console.log({
        index:
          index + 1,

        name:
          await field.getAttribute(
            'name'
          ),

        id:
          await field.getAttribute(
            'id'
          ),

        type:
          await field.getAttribute(
            'type'
          ),

        placeholder:
          await field.getAttribute(
            'placeholder'
          ),

        ariaLabel:
          await field.getAttribute(
            'aria-label'
          )
      });
    }
  }
);


