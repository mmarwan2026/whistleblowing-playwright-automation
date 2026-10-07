import {
  test,
  expect,
  Page
} from '@playwright/test';

import {
  SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';

import {
  EntitiesInvolvedStep
} from '../../../pages/public/submit-report/steps/EntitiesInvolvedStep';


// ============================================================
// WITNESSES TEST SUITE
//
// Current confirmed workflow:
//
// Reporting Notice
// -> Reporter Info
// -> Classification
// -> Allegation
// -> Person(s) Involved
// -> Entities Involved
// -> Witnesses
// -> Previous Reporting
// -> Evidence
// -> Declaration
// ============================================================


// ============================================================
// COMMON SETUP
// Navigate to Witnesses
// ============================================================

async function navigateToWitnesses(
  submit: SubmitReportPage,
  notice: ReportingNoticePage,
  page: Page
): Promise<void> {

  const entities =
    new EntitiesInvolvedStep(page);


  // ==========================================================
  // REPORTING NOTICE
  // ==========================================================

  await submit.open();

  await notice.verifyLoaded();

  await notice.next();


  // ==========================================================
  // REPORTER INFO
  // ==========================================================

  await submit.reporterInfo
    .verifyLoaded();

  await submit.reporterInfo.fill({
    identityType:
      'anonymous',

    reporterCategory:
      'Employee'
  });

  await submit.reporterInfo.next();


  // ==========================================================
  // CLASSIFICATION
  // ==========================================================

  await submit.classification
    .verifyLoaded();

  await submit.classification
    .selectInternalAuditAnswer(
      'No'
    );

  await submit.classification
    .selectCategory(
      'Nepotism/Cronyism'
    );

  await submit.classification.next();


  // ==========================================================
  // ALLEGATION
  // ==========================================================

  await submit.allegation
    .verifyLoaded();

  await submit.allegation.fill({

    incidentTitle:
      'Potential conflict of interest',

    whatHappened:
      'An employee may have participated in a decision involving a related party.',

    awarenessMethod:
      'I became aware through internal business communication.',

    knowsExactDate:
      'Yes',

    incidentDate:
      '2026-09-13',

    ongoing:
      'No'
  });

  await submit.allegation.next();


  // ==========================================================
  // PERSON(S) INVOLVED
  // ==========================================================

  await submit.personsInvolved
    .verifyLoaded();

  await submit.personsInvolved
    .selectCanIdentify(
      'No'
    );

  await submit.personsInvolved.next();


  // ==========================================================
  // ENTITIES INVOLVED
  // ==========================================================

  await entities.verifyLoaded();

  await entities
    .selectCanIdentify(
      'No'
    );

  await entities.next();


  // ==========================================================
  // WITNESSES
  // ==========================================================

  await submit.witnesses
    .verifyLoaded();
}


// ============================================================
// COMMON ASSERTION
// Witnesses -> Previous Reporting
// ============================================================

async function verifyPreviousReporting(
  page: Page
): Promise<void> {

  await expect(
    page.getByRole(
      'heading',
      {
        name:
          'Previous Reporting',

        level: 2
      }
    )
  ).toBeVisible();
}


// ============================================================
// TC-043
// Witnesses = No
// ============================================================

test(
  'TC-043 | User can select No for witnesses and continue to Previous Reporting @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses
      .selectWitnessAnswer(
        'No'
      );


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-045
// Add One Witness
//
// Includes all current Witness fields:
// First Name
// Last Name
// Position
// Department
// Company
// Notes
// ============================================================

test(
  'TC-045 | User can add one witness and continue to Previous Reporting @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the discussion related to the incident.'
        }
      ]
    });


    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(1);


    await submit.witnesses
      .verifyWitness(
        0,
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the discussion related to the incident.'
        }
      );


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);

// ============================================================
// TC-046
// Add Multiple Witnesses
// ============================================================

test(
  'TC-046 | User can add multiple witnesses @regression @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToWitnesses(
      submit,
      notice,
      page
    );

    await submit.witnesses.fill({
      hasWitnesses: 'Yes',

      witnesses: [
        {
          firstName: 'Ahmed',
          lastName: 'Hassan',
          position: 'Senior Specialist',
          department: 'Procurement',
          company: 'Red Sea Global',
          notes: 'Witnessed the initial discussion.'
        },
        {
          firstName: 'Mohamed',
          lastName: 'Ali',
          position: 'Finance Manager',
          department: 'Finance',
          company: 'QA Test Company',
          notes: 'Witnessed the approval discussion.'
        }
      ]
    });

    expect(
      await submit.witnesses.getWitnessCount()
    ).toBe(2);

    await submit.witnesses.verifyWitness(
      0,
      {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        position: 'Senior Specialist',
        department: 'Procurement',
        company: 'Red Sea Global',
        notes: 'Witnessed the initial discussion.'
      }
    );

    await submit.witnesses.verifyWitness(
      1,
      {
        firstName: 'Mohamed',
        lastName: 'Ali',
        position: 'Finance Manager',
        department: 'Finance',
        company: 'QA Test Company',
        notes: 'Witnessed the approval discussion.'
      }
    );

    await submit.witnesses.next();

    await verifyPreviousReporting(
      page
    );
  }
);

// ============================================================
// TC-047
// Remove Witness
// ============================================================

test(
  'TC-047 | User can remove a witness @regression @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    // ========================================================
    // ADD TWO WITNESSES
    // ========================================================

    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [

        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the initial discussion.'
        },

        {
          firstName:
            'Mohamed',

          lastName:
            'Ali',

          position:
            'Finance Manager',

          department:
            'Finance',

          company:
            'QA Test Company',

          notes:
            'Witnessed the approval discussion.'
        }
      ]
    });


    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(2);


    // ========================================================
    // REMOVE SECOND WITNESS
    // ========================================================

    await submit.witnesses
      .removeWitness(1);


    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(1);


    // ========================================================
    // FIRST WITNESS MUST REMAIN UNCHANGED
    // ========================================================

    await submit.witnesses
      .verifyWitness(
        0,
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the initial discussion.'
        }
      );


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-048
// Empty Witness Row Validation
// ============================================================

test(
  'TC-048 | Empty witness details prevent navigation when Yes is selected @regression @validation @negative @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses
      .selectWitnessAnswer(
        'Yes'
      );


    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(1);


    // Do not enter any Witness data.
    await submit.witnesses.next();


    // Expected current application behavior:
    // user remains on Witnesses.
    await expect(
      page.getByRole(
        'heading',
        {
          name:
            'Witnesses',

          level: 2
        }
      )
    ).toBeVisible();


    await expect(
      page.getByRole(
        'heading',
        {
          name:
            'Previous Reporting',

          level: 2
        }
      )
    ).toBeHidden();
  }
);


// ============================================================
// TC-049
// Back Navigation + Data Persistence
//
// Witnesses
// -> Entities Involved
// -> Witnesses
// ============================================================

test(
  'TC-049 | Witness data persists after Back navigation @regression @navigation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    const entities =
      new EntitiesInvolvedStep(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    // ========================================================
    // ENTER DATA
    // ========================================================

    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(1);


    await submit.witnesses
      .verifyWitness(
        0,
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      );


    // ========================================================
    // BACK -> ENTITIES INVOLVED
    // ========================================================

    await submit.witnesses.back();


    await entities.verifyLoaded();


    await expect(
      page.getByRole(
        'radio',
        {
          name:
            'No',

          exact: true
        }
      )
    ).toBeChecked();


    // ========================================================
    // NEXT -> WITNESSES
    // ========================================================

    await entities.next();


    await submit.witnesses
      .verifyLoaded();


    // ========================================================
    // YES MUST PERSIST
    // ========================================================

    await expect(
      page.getByRole(
        'radio',
        {
          name:
            'Yes',

          exact: true
        }
      )
    ).toBeChecked();


    // ========================================================
    // ROW MUST PERSIST
    // ========================================================

    expect(
      await submit.witnesses
        .getWitnessCount()
    ).toBe(1);


    // ========================================================
    // ALL VALUES MUST PERSIST
    // ========================================================

    await submit.witnesses
      .verifyWitness(
        0,
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      );
  }
);


// ============================================================
// TC-050
// First Name Optional
//
// Previously discovered behavior:
// First Name can be empty when other Witness data exists.
// ============================================================

test(
  'TC-050 | Witness First Name is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            '',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-051
// Last Name Optional
// ============================================================

test(
  'TC-051 | Witness Last Name is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            '',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-052
// Position Optional
// ============================================================

test(
  'TC-052 | Witness Position is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            '',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-053
// Department Optional
// ============================================================

test(
  'TC-053 | Witness Department is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            '',

          company:
            'Red Sea Global',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);


// ============================================================
// TC-054
// Company Validation Discovery
//
// Company is a newly discovered current UI field.
//
// We do NOT assume Mandatory or Optional.
// This test discovers the current application behavior.
// ============================================================

test(
  'TC-054 | Company validation when witness is identified @diagnostic @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            '',

          notes:
            'Witnessed the incident discussion.'
        }
      ]
    });


    await submit.witnesses.next();


    const witnessesHeading =
      page.getByRole(
        'heading',
        {
          name:
            'Witnesses',

          level: 2
        }
      );


    const previousReportingHeading =
      page.getByRole(
        'heading',
        {
          name:
            'Previous Reporting',

          level: 2
        }
      );


    if (
      await witnessesHeading
        .isVisible()
    ) {

      console.log(
        'RESULT: Witness Company is Mandatory'
      );

    } else if (
      await previousReportingHeading
        .isVisible()
    ) {

      console.log(
        'RESULT: Witness Company is Optional'
      );
    }


    expect(
      (
        await witnessesHeading
          .isVisible()
      ) ||
      (
        await previousReportingHeading
          .isVisible()
      )
    ).toBeTruthy();
  }
);


// ============================================================
// TC-055
// Notes Optional
//
// Previously discovered behavior:
// Notes can be empty.
// ============================================================

test(
  'TC-055 | Witness Notes is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);


    await navigateToWitnesses(
      submit,
      notice,
      page
    );


    await submit.witnesses.fill({

      hasWitnesses:
        'Yes',

      witnesses: [
        {
          firstName:
            'Ahmed',

          lastName:
            'Hassan',

          position:
            'Senior Specialist',

          department:
            'Procurement',

          company:
            'Red Sea Global',

          notes:
            ''
        }
      ]
    });


    await submit.witnesses.next();


    await verifyPreviousReporting(
      page
    );
  }
);