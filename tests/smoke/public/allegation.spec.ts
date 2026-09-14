import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

test(
  'TC-014 | User can complete Allegation and continue to Person(s) Involved @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open portal
    await submit.open();

    // 2. Reporting Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Reporter Info
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // 4. Classification
    await submit.classification.verifyLoaded();

    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // 5. Allegation
    await submit.allegation.verifyLoaded();

    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'An employee may have participated in a decision involving a related party.',
      rulePolicyLaw:
        'Conflict of Interest Policy',
      awarenessMethod:
        'I became aware through internal business communication.',
      incidentLocation:
        'Riyadh Office',
      knowsExactDate: 'Yes',
      incidentDate: '2026-09-09',
      ongoing: 'No'
    });

    await submit.allegation.next();

    // 6. Verify next step
    await expect(
      page.getByRole('heading', {
        name: 'Person(s) Involved',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-015 | Allegation mandatory fields validation @negative @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // 1. Open portal
    await submit.open();

    // 2. Notice
    await notice.verifyLoaded();
    await notice.next();

    // 3. Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // 4. Classification
    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );
    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // 5. Allegation loaded
    await submit.allegation.verifyLoaded();

    // 6. Do NOT fill mandatory fields
    await submit.allegation.next();

    // 7. User must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    // 8. Required inputs should be invalid
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toHaveAttribute('aria-invalid', 'true');

    await expect(
      page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toHaveAttribute('aria-invalid', 'true');

    await expect(
      page.getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toHaveAttribute('aria-invalid', 'true');
  }
);test(
  'TC-016 | Incident Date field is hidden when Exact Date is No @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    await submit.classification.selectInternalAuditAnswer('No');
    await submit.classification.selectCategory(
      'Conflict of Interest'
    );
    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    await submit.allegation.verifyLoaded();

    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',
      whatHappened:
        'An employee may have participated in a decision involving a related party.',
      awarenessMethod:
        'I became aware through internal business communication.',
      incidentLocation:
        'Riyadh Office',
      knowsExactDate: 'No',
      ongoing: 'No'
    });

    await expect(
      page.getByRole('textbox', {
        name: 'Incident Date',
        exact: true
      })
    ).toBeHidden();

    await submit.allegation.next();

    await expect(
      page.getByRole('heading', {
        name: 'Person(s) Involved',
        level: 2
      })
    ).toBeVisible();
  }
);const ongoingOptions = [
  'Yes',
  'No',
  "I don't know"
] as const;

for (const ongoing of ongoingOptions) {

  test(
    `TC-017 | User can select "${ongoing}" for Issue Still Ongoing @public @intake`,
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

      await submit.classification.selectCategory(
        'Conflict of Interest'
      );

      await submit.classification.selectSubcategory(
        'Nepotism/Cronyism'
      );

      await submit.classification.next();

      // Allegation
      await submit.allegation.verifyLoaded();

      await submit.allegation.fill({
        incidentTitle: 'Potential conflict of interest',

        whatHappened:
          'An employee may have participated in a decision involving a related party.',

        awarenessMethod:
          'I became aware through internal business communication.',

        knowsExactDate: 'No',

        ongoing
      });

      // Verify selected value
      const ongoingGroup = page.getByRole(
        'radiogroup',
        {
          name: 'Is Incident Ongoing?'
        }
      );

      await expect(
        ongoingGroup.getByRole('radio', {
          name: ongoing,
          exact: true
        })
      ).toBeChecked();

      // Continue
      await submit.allegation.next();

      await expect(
        page.getByRole('heading', {
          name: 'Person(s) Involved',
          level: 2
        })
      ).toBeVisible();
    }
  );
}test(
  'TC-018 | Incident Date is required when Exact Date is Yes @negative @public @intake',
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

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date = Yes
    await submit.allegation.selectExactDate('Yes');

    // Do NOT enter Incident Date
    await submit.allegation.selectOngoing('No');

    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    // Incident Date should still be visible
    const incidentDate = page.getByRole('textbox', {
      name: 'Incident Date',
      exact: true
    });

    await expect(incidentDate).toBeVisible();
    await expect(incidentDate).toHaveValue('');
  }
);test(
  'TC-019 | Allegation data is preserved after Back and returning to Allegation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // =========================================================
    // 1. Open portal
    // =========================================================
    await submit.open();

    // =========================================================
    // 2. Reporting Notice
    // =========================================================
    await notice.verifyLoaded();
    await notice.next();

    // =========================================================
    // 3. Reporter Info
    // =========================================================
    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // =========================================================
    // 4. Classification
    // =========================================================
    await submit.classification.verifyLoaded();

    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // =========================================================
    // 5. Allegation
    // =========================================================
    await submit.allegation.verifyLoaded();

    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      rulePolicyLaw:
        'Conflict of Interest Policy',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Riyadh Office',

      knowsExactDate: 'Yes',

      incidentDate: '2026-09-13',

      ongoing: 'No'
    });

    // =========================================================
    // 6. Back -> Classification
    // =========================================================
    await submit.allegation.back();

    await submit.classification.verifyLoaded();

    // =========================================================
    // 7. Verify Classification data is preserved
    // =========================================================
    await expect(
      page.getByRole('radio', {
        name: 'No',
        exact: true
      }).first()
    ).toBeChecked();

    await expect(
      page.getByRole('combobox', {
        name: 'Category',
        exact: true
      })
    ).toHaveValue('Conflict of Interest');

    await expect(
      page.getByRole('combobox', {
        name: 'Subcategory',
        exact: true
      })
    ).toHaveValue('Nepotism/Cronyism');

    // =========================================================
    // 8. Forward -> Allegation
    // =========================================================
    await submit.classification.next();

    await submit.allegation.verifyLoaded();

    // =========================================================
    // 9. Verify Allegation text fields are preserved
    // =========================================================
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toHaveValue(
      'Potential conflict of interest'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toHaveValue(
      'An employee may have participated in a decision involving a related party.'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'What Rule, Policy, or Law May Have Been Violated?',
        exact: true
      })
    ).toHaveValue(
      'Conflict of Interest Policy'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toHaveValue(
      'I became aware through internal business communication.'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'Incident Location',
        exact: true
      })
    ).toHaveValue(
      'Riyadh Office'
    );

    // =========================================================
    // 10. Verify Exact Date = Yes is preserved
    // =========================================================
    const exactDateGroup = page
      .getByRole('radiogroup')
      .first();

    await expect(
      exactDateGroup.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    // =========================================================
    // 11. Verify Incident Date is preserved
    // =========================================================
    const incidentDate = page.getByRole(
      'textbox',
      {
        name: 'Incident Date',
        exact: true
      }
    );

    await expect(incidentDate).toBeVisible();

    await expect(
      incidentDate
    ).toHaveValue(
      '2026-09-13'
    );

    // =========================================================
    // 12. Verify Ongoing = No is preserved
    // =========================================================
    const ongoingGroup = page.getByRole(
      'radiogroup',
      {
        name: 'Is Incident Ongoing?'
      }
    );

    await expect(
      ongoingGroup.getByRole('radio', {
        name: 'No',
        exact: true
      })
    ).toBeChecked();
  }
);test(
  'TC-020 | Changing Exact Date from Yes to No hides Incident Date and allows continuation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    // Open
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

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date = Yes
    await submit.allegation.selectExactDate('Yes');

    const incidentDate = page.getByRole('textbox', {
      name: 'Incident Date',
      exact: true
    });

    await expect(incidentDate).toBeVisible();

    // Enter date
    await submit.allegation.fillIncidentDate(
      '2026-09-13'
    );

    await expect(incidentDate).toHaveValue(
      '2026-09-13'
    );

    // Change Yes -> No
    await submit.allegation.selectExactDate('No');

    // Conditional field must disappear
    await expect(incidentDate).toBeHidden();

    // Complete remaining required selection
    await submit.allegation.selectOngoing('No');

    // Continue
    await submit.allegation.next();

    // Verify next wizard step
    await expect(
      page.getByRole('heading', {
        name: 'Person(s) Involved',
        level: 2
      })
    ).toBeVisible();
  }
);