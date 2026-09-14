import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

test(
  'TC-007 | User can complete Classification and continue to Allegation @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open public portal
    await submit.open();

    // 2. Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // 4. Verify Classification
    await submit.classification.verifyLoaded();

    // 5. Internal Audit question = No
    await submit.classification.selectInternalAuditAnswer('No');

    // 6. Select Category
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    // 7. Select Subcategory
    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    // 8. Continue
    await submit.classification.next();

    // 9. Verify Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-008 | Classification mandatory fields validation @regression @validation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // Open portal
    await submit.open();

    // Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.verifyLoaded();

    // Do NOT select:
    // - Internal Audit Yes/No
    // - Category
    // - Subcategory

    await submit.classification.next();

    // Verify user cannot leave Classification
    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();

    // Verify general validation alert
    await expect(
      page.getByRole('alert').filter({
        hasText: 'Please complete all mandatory fields'
      })
    ).toBeVisible();
  }
);test(
  'TC-009 | Conflict of Interest loads correct Subcategory options @regression @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.verifyLoaded();

    // Select Category
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    const subcategory = page.getByRole('combobox', {
      name: 'Subcategory',
      exact: true
    });

    // Verify real dependent options
    await expect(
      subcategory.getByRole('option', {
        name: 'Nepotism/Cronyism'
      })
    ).toBeAttached();

    await expect(
      subcategory.getByRole('option', {
        name: 'Secondary Employment (Undisclosed)'
      })
    ).toBeAttached();

    await expect(
      subcategory.getByRole('option', {
        name: 'Gifts & Hospitality Violations'
      })
    ).toBeAttached();
  }
);test(
  'TC-010 | Internal Audit Yes can be selected on Classification @regression @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.verifyLoaded();

    // Select Internal Audit = Yes
    await submit.classification.selectInternalAuditAnswer('Yes');

    // Verify Yes selected
    await expect(
      page.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    // Verify No not selected
    await expect(
      page.getByRole('radio', {
        name: 'No',
        exact: true
      })
    ).not.toBeChecked();

    // Category remains available
    await expect(
      page.getByRole('combobox', {
        name: 'Category',
        exact: true
      })
    ).toBeVisible();

    // Subcategory remains available
    await expect(
      page.getByRole('combobox', {
        name: 'Subcategory',
        exact: true
      })
    ).toBeVisible();

    // Still on Classification
    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-011 | Back from Classification returns to Reporter Info and preserves data @regression @navigation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open portal
    await submit.open();

    // 2. Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // 4. Verify Classification
    await submit.classification.verifyLoaded();

    // 5. Click Back
    await submit.classification.back();

    // 6. Verify Reporter Info
    await submit.reporterInfo.verifyLoaded();

    // 7. Verify Anonymous remains selected
    await expect(
      page.getByRole('radio', {
        name: 'Remain anonymous'
      })
    ).toBeChecked();

    // 8. Verify Reporter Category remains Employee
    await expect(
      page.getByRole('combobox', {
        name: 'Reporter Category'
      })
    ).toHaveValue('Employee');
  }
);test(
  'TC-012 | Changing Category resets previous Subcategory @regression @validation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.verifyLoaded();

    // Select first Category
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    // Select Subcategory belonging to first Category
    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    const subcategory = page.getByRole('combobox', {
      name: 'Subcategory',
      exact: true
    });

    // Confirm initial Subcategory
    await expect(
      subcategory.locator('option:checked')
    ).toHaveText('Nepotism/Cronyism');

    // Change Category
    await submit.classification.selectCategory(
      'Health, Safety & Environment'
    );

    // Previous Subcategory must be cleared
    await expect(
      subcategory.locator('option:checked')
    ).toHaveText('Select Subcategory');

    // Old Subcategory must no longer exist
    await expect(
      subcategory.getByRole('option', {
        name: 'Nepotism/Cronyism'
      })
    ).toHaveCount(0);

    // New dependent options must be loaded
    await expect(
      subcategory.getByRole('option', {
        name: 'Safety Protocol Breaches'
      })
    ).toBeAttached();

    await expect(
      subcategory.getByRole('option', {
        name: 'Failure to Use PPE'
      })
    ).toBeAttached();

    await expect(
      subcategory.getByRole('option', {
        name: 'Environmental Pollution'
      })
    ).toBeAttached();

    await expect(
      subcategory.getByRole('option', {
        name: 'Concealing Injuries'
      })
    ).toBeAttached();
  }
);test(
  'TC-013 | Subcategory is mandatory after selecting Category @regression @validation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Complete Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.verifyLoaded();

    // Select Internal Audit answer
    await submit.classification
      .selectInternalAuditAnswer('No');

    // Select Category only
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    // Do NOT select Subcategory
    await submit.classification.next();

    // Verify validation summary
    await expect(
      page.getByRole('alert').filter({
        hasText: 'Please complete all mandatory fields'
      })
    ).toBeVisible();

    // Verify Subcategory is invalid
    const subcategory = page.getByRole('combobox', {
      name: 'Subcategory',
      exact: true
    });

    await expect(subcategory).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Must remain on Classification
    await expect(
      page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();
  }
);
