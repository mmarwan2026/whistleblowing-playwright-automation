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

test(
  'TC-001 | Anonymous reporter can continue to Classification @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Reporting & Confidentiality Notice
    await notice.verifyLoaded();

    // 3. Continue
    await notice.next();

    // 4. Reporter Info
    await submit
      .reporterInfo
      .verifyLoaded();

    // 5. Anonymous + Modal + Category
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    // 6. Continue
    await submit
      .reporterInfo
      .next();

    // 7. Classification page
    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();
  }
);

test(
  'TC-002 | Identified reporter can continue to Classification @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'identified',
      reporterCategory: 'Employee'
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
test(
  'TC-003 | Reporter Category is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Reporting & Confidentiality Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Verify Reporter Info loaded
    await submit.reporterInfo.verifyLoaded();

    // 4. Select Anonymous
    await submit.reporterInfo.selectAnonymous();

    // 5. Do NOT select Reporter Category
    await submit.reporterInfo.next();

    // 6. Verify general validation alert
    await expect(
      page.getByRole('alert').filter({
        hasText: 'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // 7. Verify Reporter Category is invalid
    const reporterCategory = page.getByRole('combobox', {
      name: 'Reporter Category'
    });

    await expect(reporterCategory).toBeVisible();

    await expect(
      reporterCategory
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // 8. Verify user remains on Reporter Info
    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-004 | Identity selection is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Continue from Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Verify Reporter Info
    await submit.reporterInfo.verifyLoaded();

    // 4. Do NOT select identity
    // Do NOT select Reporter Category

    // 5. Click Next
    await submit.reporterInfo.next();

    // 6. Verify validation alert
    await expect(
      page.getByRole('alert').filter({
        hasText: 'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // 7. Verify no identity option was selected
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

    // 8. Must remain on Reporter Info
    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-005 | Back button is disabled on Reporter Info first step @regression @navigation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Continue from Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Verify Reporter Info
    await submit.reporterInfo.verifyLoaded();

    // 4. Verify Back button
    const backButton = page.getByRole('button', {
      name: 'Back'
    });

    await expect(backButton).toBeVisible();

    // 5. Reporter Info is first wizard step,
    // therefore Back must be disabled
    await expect(backButton).toBeDisabled();

    // 6. Verify we are still on Reporter Info
    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-006 | Quick Exit is available on Reporter Info @regression @security @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Continue from Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Verify Reporter Info
    await submit.reporterInfo.verifyLoaded();

    // 4. Verify Quick Exit
    const quickExit = page.getByRole('button', {
      name: 'QUICK EXIT (ESC)'
    });

    await expect(quickExit).toBeVisible();
    await expect(quickExit).toBeEnabled();

    // 5. Verify we are still on Reporter Info
    await expect(
      page.getByRole('heading', {
        name: 'Reporter Info',
        level: 2
      })
    ).toBeVisible();
  }
);