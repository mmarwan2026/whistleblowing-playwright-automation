import { test, expect } from '@playwright/test';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

test(
  'TC-021 | User can select No for identifying persons involved and continue to Witnesses @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    // Notice
    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });
    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory('Conflict of Interest');
    await submit.classification.selectSubcategory('Nepotism/Cronyism');
    await submit.classification.next();

    // Allegation
    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'An employee may have participated in a decision involving a related party.',
      awarenessMethod:
        'I became aware through internal business communication.',
      knowsExactDate: 'No',
      incidentDateDescription:
        'The incident occurred approximately during September 2026.',
      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.selectCanIdentify('No');

    await submit.personsInvolved.next();

    // Witnesses
    await page
      .getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
      .waitFor({ state: 'visible' });
  }
);test(
  'TC-022 | User can identify and add one involved person then continue to Witnesses @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    // Notice
    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
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
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.fill({
      canIdentify: 'Yes',

      persons: [
        {
          fullName: 'Ahmed Hassan',
          position: 'Procurement Manager',
          company: 'Red Sea Global',

          department: 'Procurement',

          email:
            'ahmed.hassan@example.com',

          phone:
            '0501234567',

          roleInIncident:
            'Decision maker'
        }
      ]
    });

    await submit.personsInvolved.next();

    // Witnesses
    await page
      .getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
      .waitFor({
        state: 'visible'
      });
  }
);test(
  'TC-023 | User can add multiple involved persons @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });
    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory('Conflict of Interest');
    await submit.classification.selectSubcategory('Nepotism/Cronyism');
    await submit.classification.next();

    // Allegation
    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'Multiple employees may have participated in a decision involving a related party.',
      awarenessMethod:
        'I became aware through internal business communication.',
      knowsExactDate: 'No',
      incidentDateDescription:
        'The incident occurred approximately during September 2026.',
      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.fill({
      canIdentify: 'Yes',

      persons: [
        {
          fullName: 'Ahmed Hassan',
          position: 'Procurement Manager',
          company: 'Red Sea Global',
          department: 'Procurement',
          email: 'ahmed.hassan@example.com',
          phone: '0501234567',
          roleInIncident: 'Decision maker'
        },

        {
          fullName: 'Mohamed Ali',
          position: 'Vendor Manager',
          company: 'Example Vendor',
          department: 'Vendor Management',
          email: 'mohamed.ali@example.com',
          phone: '0507654321',
          roleInIncident: 'Related party'
        }
      ]
    });

    // Verify two person rows
    expect(
      await submit.personsInvolved.getPersonCount()
    ).toBe(2);

    await submit.personsInvolved.next();

    // Witnesses
    await expect(
      page.getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-024 | User can remove an involved person @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    // Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',

      whatHappened:
        'Multiple employees may have participated in a decision involving a related party.',

      awarenessMethod:
        'I became aware through internal business communication.',

      knowsExactDate: 'No',

      incidentDateDescription:
        'The incident occurred approximately during September 2026.',

      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.fill({
      canIdentify: 'Yes',

      persons: [
        {
          fullName: 'Ahmed Hassan',
          position: 'Procurement Manager',
          company: 'Red Sea Global'
        },
        {
          fullName: 'Mohamed Ali',
          position: 'Vendor Manager',
          company: 'Example Vendor'
        }
      ]
    });

    // Two persons should exist
    expect(
      await submit.personsInvolved.getPersonCount()
    ).toBe(2);

    // Remove second person
    await submit.personsInvolved.removePerson(1);

    // Only one person should remain
    expect(
      await submit.personsInvolved.getPersonCount()
    ).toBe(1);

    // Continue
    await submit.personsInvolved.next();

    await expect(
      page.getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-025 | Mandatory person fields validation @negative @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });
    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory('Conflict of Interest');
    await submit.classification.selectSubcategory('Nepotism/Cronyism');
    await submit.classification.next();

    // Allegation
    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'An employee may have participated in a decision involving a related party.',
      awarenessMethod:
        'I became aware through internal business communication.',
      knowsExactDate: 'No',
      incidentDateDescription:
        'The incident occurred approximately during September 2026.',
      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.selectCanIdentify('Yes');

    // Leave person mandatory fields empty
    await submit.personsInvolved.next();

    // Must remain on Person(s) Involved
    await expect(
      page.getByRole('heading', {
        name: 'Person(s) Involved',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-026 | Person involved data persists after Back navigation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });
    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory('Conflict of Interest');
    await submit.classification.selectSubcategory('Nepotism/Cronyism');
    await submit.classification.next();

    // Allegation
    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'An employee may have participated in a decision involving a related party.',
      awarenessMethod:
        'I became aware through internal business communication.',
      knowsExactDate: 'No',
      incidentDateDescription:
        'The incident occurred approximately during September 2026.',
      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved.fill({
      canIdentify: 'Yes',
      persons: [
        {
          fullName: 'Ahmed Hassan',
          position: 'Procurement Manager',
          company: 'Red Sea Global',
          department: 'Procurement',
          email: 'ahmed.hassan@example.com',
          phone: '0501234567',
          roleInIncident: 'Decision maker'
        }
      ]
    });

    // Back to Allegation
    await submit.personsInvolved.back();

    await submit.allegation.verifyLoaded();

    // Return using Next
    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();

    // Verify Yes remains selected
    await expect(
      page.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    // Verify person count remains
    expect(
      await submit.personsInvolved.getPersonCount()
    ).toBe(1);

    // Verify saved data
    const table = page.getByRole('table');
    const personRow = table.getByRole('row').nth(1);
    const fields = personRow.getByRole('textbox');

    await expect(fields.nth(0)).toHaveValue('Ahmed Hassan');
    await expect(fields.nth(1)).toHaveValue('Procurement Manager');
    await expect(fields.nth(2)).toHaveValue('Red Sea Global');
    await expect(fields.nth(3)).toHaveValue('Procurement');
    await expect(fields.nth(4)).toHaveValue('ahmed.hassan@example.com');
    await expect(fields.nth(5)).toHaveValue('0501234567');
    await expect(fields.nth(6)).toHaveValue('Decision maker');
  }
);