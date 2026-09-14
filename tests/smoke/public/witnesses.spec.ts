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
// COMMON SETUP
// Navigate to Witnesses Step
// ============================================================

async function navigateToWitnesses(
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
  await submit.witnesses.verifyLoaded();
}


// ============================================================
// TC-027
// Witnesses = No
// ============================================================

test(
  'TC-027 | User can select No for witnesses and continue to Evidence @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    await submit.witnesses
      .selectWitnessAnswer('No');

    await submit.witnesses.next();

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
// TC-028
// Witnesses = I don't know
// ============================================================

test(
  "TC-028 | User can select I don't know for witnesses and continue to Evidence @public @intake",
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    await submit.witnesses
      .selectWitnessAnswer(
        "I don't know"
      );

    await submit.witnesses.next();

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
// TC-029
// Witnesses = Yes
// One Witness
// ============================================================

test(
  'TC-029 | User can add one witness and continue to Evidence @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    await submit.witnesses.fill({
      hasWitnesses: 'Yes',

      witnesses: [
        {
          firstName: 'Ahmed',

          lastName: 'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          notes:
            'Witnessed the discussion related to the incident.'
        }
      ]
    });

    await submit.witnesses.next();

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
);test(
  'TC-030 | User can add multiple witnesses @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    await submit.witnesses.fill({
      hasWitnesses: 'Yes',

      witnesses: [
        {
          firstName: 'Ahmed',
          lastName: 'Hassan',
          position: 'Senior Specialist',
          department: 'Procurement',
          notes: 'Witnessed the initial discussion.'
        },
        {
          firstName: 'Mohamed',
          lastName: 'Ali',
          position: 'Finance Manager',
          department: 'Finance',
          notes: 'Witnessed the approval discussion.'
        }
      ]
    });

    expect(
      await submit.witnesses.getWitnessCount()
    ).toBe(2);

    await submit.witnesses.next();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-031 | User can remove a witness @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    // Add two witnesses
    await submit.witnesses.fill({
      hasWitnesses: 'Yes',

      witnesses: [
        {
          firstName: 'Ahmed',
          lastName: 'Hassan',
          position: 'Senior Specialist',
          department: 'Procurement',
          notes: 'Witnessed the initial discussion.'
        },
        {
          firstName: 'Mohamed',
          lastName: 'Ali',
          position: 'Finance Manager',
          department: 'Finance',
          notes: 'Witnessed the approval discussion.'
        }
      ]
    });

    // Verify two witnesses
    expect(
      await submit.witnesses.getWitnessCount()
    ).toBe(2);

    // Remove second witness
    await submit.witnesses.removeWitness(1);

    // Verify only one remains
    expect(
      await submit.witnesses.getWitnessCount()
    ).toBe(1);

    // Continue
    await submit.witnesses.next();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-032 | Witness details validation when Yes is selected @negative @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice
    );

    // Select Yes
    await submit.witnesses
      .selectWitnessAnswer('Yes');

    // Do not enter witness information
    await submit.witnesses.next();

    // User should remain on Witnesses
    await expect(
      page.getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
    ).toBeVisible();
  }
);test(
  'TC-033 | Witness data persists after Back navigation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToWitnesses(submit, notice);

    await submit.witnesses.fill({
      hasWitnesses: 'Yes',
      witnesses: [
        {
          firstName: 'Ahmed',
          lastName: 'Hassan',
          position: 'Senior Specialist',
          department: 'Procurement',
          notes: 'Witnessed the incident discussion.'
        }
      ]
    });

    // Back → Person(s) Involved
    await submit.witnesses.back();

    await submit.personsInvolved.verifyLoaded();

    // Return → Witnesses
    await submit.personsInvolved.next();

    await submit.witnesses.verifyLoaded();

    // Yes should remain selected
    await expect(
      page.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    // Witness should still exist
    expect(
      await submit.witnesses.getWitnessCount()
    ).toBe(1);

    const table = page.getByRole('table');
    const witnessRow = table.getByRole('row').nth(1);
    const fields = witnessRow.getByRole('textbox');

    await expect(fields.nth(0)).toHaveValue('Ahmed');
    await expect(fields.nth(1)).toHaveValue('Hassan');
    await expect(fields.nth(2)).toHaveValue('Senior Specialist');
    await expect(fields.nth(3)).toHaveValue('Procurement');
    await expect(fields.nth(4)).toHaveValue(
      'Witnessed the incident discussion.'
    );
  }
);