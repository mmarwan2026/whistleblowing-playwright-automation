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


// ============================================================
// SHARED TEST DATA
// ============================================================

const validPerson = {
  fullName: 'Ahmed Hassan',
  position: 'Procurement Manager',
  company: 'Red Sea Global',
  department: 'Procurement',
  email: 'ahmed.hassan@example.com',
  phone: '0501234567',
  roleInIncident: 'Accused' as const
};


// ============================================================
// NAVIGATION HELPER
// Reporting Notice
// -> Reporter Info
// -> Classification
// -> Allegation
// -> Person(s) Involved
// ============================================================

async function navigateToPersonsInvolved(
  submit: SubmitReportPage,
  notice: ReportingNoticePage
): Promise<void> {

  // ----------------------------------------------------------
  // Open Submit Report
  // ----------------------------------------------------------

  await submit.open();


  // ----------------------------------------------------------
  // Reporting Notice
  // ----------------------------------------------------------

  await notice.verifyLoaded();

  await notice.next();


  // ----------------------------------------------------------
  // Reporter Info
  // ----------------------------------------------------------

  await submit.reporterInfo.verifyLoaded();

  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });

  await submit.reporterInfo.next();


  // ----------------------------------------------------------
  // Classification
  // ----------------------------------------------------------

  await submit.classification.verifyLoaded();

  await submit.classification.selectInternalAuditAnswer(
    'No'
  );

  await submit.classification.selectCategory(
    'Nepotism/Cronyism'
  );

  await submit.classification.next();


  // ----------------------------------------------------------
  // Allegation
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // Person(s) Involved
  // ----------------------------------------------------------

  await submit.personsInvolved.verifyLoaded();
}


// ============================================================
// VERIFY PERSON(S) INVOLVED STEP
// ============================================================

async function verifyPersonsInvolvedLoaded(
  page: Page
): Promise<void> {

  await expect(
    page.getByRole(
      'heading',
      {
        name: 'Person(s) Involved',
        level: 2
      }
    )
  ).toBeVisible();
}


// ============================================================
// VERIFY ENTITIES INVOLVED STEP
// ============================================================

async function verifyEntitiesInvolvedLoaded(
  page: Page
): Promise<void> {

  await expect(
    page.getByRole(
      'heading',
      {
        name: 'Entities Involved',
        exact: true
      }
    )
  ).toBeVisible();
}


// ============================================================
// TEST SUITE
// ============================================================

test.describe(
  'Person(s) Involved @public @intake',
  () => {


    // ========================================================
    // TC-029
    // User cannot identify persons
    // ========================================================

    test(
      'TC-029 | User can select No for identifying persons involved and continue to Entities Involved @smoke',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.selectCanIdentify(
          'No'
        );


        await expect(
          page.getByRole(
            'radio',
            {
              name: 'No',
              exact: true
            }
          )
        ).toBeChecked();


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-030
    // One valid involved person
    // ========================================================

    test(
      'TC-030 | User can identify and add one involved person then continue to Entities Involved @smoke',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            validPerson
          ]
        });


        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(1);


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-031
    // Required validation - all required fields empty
    // ========================================================

    test(
      'TC-031 | Mandatory person fields validation when all required fields are empty @regression @validation @negative',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.selectCanIdentify(
          'Yes'
        );


        // Do not enter any person information.

        await submit.personsInvolved.next();


        // Navigation must be blocked.

        await verifyPersonsInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-032
    // Full Name mandatory
    // ========================================================

    test(
      'TC-032 | Full Name is mandatory when person can be identified @regression @validation @negative',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              fullName: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyPersonsInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-033
    // Position mandatory
    // ========================================================

    test(
      'TC-033 | Position is mandatory when person can be identified @regression @validation @negative',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              position: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyPersonsInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-034
    // Company mandatory
    // ========================================================

    test(
      'TC-034 | Company is mandatory when person can be identified @regression @validation @negative',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              company: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyPersonsInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-035
    // Department optional
    //
    // UI header:
    // DEPARTMENT
    // No required marker.
    // ========================================================

    test(
      'TC-035 | Department is optional when person can be identified @regression @validation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              department: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-036
    // Email optional
    // ========================================================

    test(
      'TC-036 | Email is optional when person can be identified @regression @validation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              email: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-037
    // Phone optional
    // ========================================================

    test(
      'TC-037 | Phone is optional when person can be identified @regression @validation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              ...validPerson,

              phone: ''
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-038
    // Role In Incident optional
    //
    // Current control = SELECT
    // Current values = Accused / Victim
    // ========================================================

    test(
      'TC-038 | Role in Incident is optional when person can be identified @regression @validation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              fullName:
                validPerson.fullName,

              position:
                validPerson.position,

              company:
                validPerson.company,

              department:
                validPerson.department,

              email:
                validPerson.email,

              phone:
                validPerson.phone

              // roleInIncident intentionally omitted
            }
          ]
        });


        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-039
    // Add multiple involved persons
    // ========================================================

    test(
      'TC-039 | User can add multiple involved persons @regression',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [

            // Person 1
            {
              fullName: 'Ahmed Hassan',
              position: 'Procurement Manager',
              company: 'Red Sea Global',
              department: 'Procurement',
              email: 'ahmed.hassan@example.com',
              phone: '0501234567',
              roleInIncident: 'Accused'
            },


            // Person 2
            {
              fullName: 'Mohamed Ali',
              position: 'Vendor Manager',
              company: 'Example Vendor',
              department: 'Vendor Management',
              email: 'mohamed.ali@example.com',
              phone: '0507654321',
              roleInIncident: 'Victim'
            }
          ]
        });


        // ----------------------------------------------------
        // Verify two rows exist.
        // ----------------------------------------------------

        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(2);


        // ----------------------------------------------------
        // Verify Person 2 data directly from current UI.
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 2',
              exact: true
            }
          )
        ).toHaveValue(
          'Mohamed Ali'
        );


        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Position 2',
              exact: true
            }
          )
        ).toHaveValue(
          'Vendor Manager'
        );


        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Company 2',
              exact: true
            }
          )
        ).toHaveValue(
          'Example Vendor'
        );


        await expect(
          page.getByRole(
            'combobox',
            {
              name: 'Role In Incident 2',
              exact: true
            }
          )
        ).toHaveValue(
          'Victim'
        );


        // ----------------------------------------------------
        // Continue workflow.
        // ----------------------------------------------------

        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-040
    // Remove second involved person
    // ========================================================

    test(
      'TC-040 | User can remove an involved person @regression',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [

            // Person 1
            {
              fullName: 'Ahmed Hassan',
              position: 'Procurement Manager',
              company: 'Red Sea Global',
              roleInIncident: 'Accused'
            },


            // Person 2
            {
              fullName: 'Mohamed Ali',
              position: 'Vendor Manager',
              company: 'Example Vendor',
              roleInIncident: 'Victim'
            }
          ]
        });


        // ----------------------------------------------------
        // Precondition:
        // two rows exist.
        // ----------------------------------------------------

        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(2);


        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 2',
              exact: true
            }
          )
        ).toHaveValue(
          'Mohamed Ali'
        );


        // ----------------------------------------------------
        // Remove Person 2.
        //
        // Index is zero-based:
        // Person 1 = 0
        // Person 2 = 1
        // ----------------------------------------------------

        await submit.personsInvolved.removePerson(
          1
        );


        // ----------------------------------------------------
        // Verify only one person remains.
        // ----------------------------------------------------

        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(1);


        // ----------------------------------------------------
        // Person 1 must remain.
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Ahmed Hassan'
        );


        // ----------------------------------------------------
        // Person 2 must no longer exist.
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 2',
              exact: true
            }
          )
        ).toHaveCount(0);


        // ----------------------------------------------------
        // Continue workflow.
        // ----------------------------------------------------

        await submit.personsInvolved.next();


        await verifyEntitiesInvolvedLoaded(
          page
        );
      }
    );


    // ========================================================
    // TC-041
    // Persistence after Back navigation
    // ========================================================

    test(
      'TC-041 | Person involved data persists after Back navigation @regression @navigation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            validPerson
          ]
        });


        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(1);


        // ----------------------------------------------------
        // Back:
        // Person(s) Involved -> Allegation
        // ----------------------------------------------------

        await submit.personsInvolved.back();


        await submit.allegation.verifyLoaded();


        // ----------------------------------------------------
        // Forward:
        // Allegation -> Person(s) Involved
        // ----------------------------------------------------

        await submit.allegation.next();


        await submit.personsInvolved.verifyLoaded();


        // ----------------------------------------------------
        // Yes selection persists.
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'radio',
            {
              name: 'Yes',
              exact: true
            }
          )
        ).toBeChecked();


        // ----------------------------------------------------
        // Person row persists.
        // ----------------------------------------------------

        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(1);


        // ----------------------------------------------------
        // Full Name
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Ahmed Hassan'
        );


        // ----------------------------------------------------
        // Position
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Position 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Procurement Manager'
        );


        // ----------------------------------------------------
        // Company
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Company 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Red Sea Global'
        );


        // ----------------------------------------------------
        // Department
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Department 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Procurement'
        );


        // ----------------------------------------------------
        // Email
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Email 1',
              exact: true
            }
          )
        ).toHaveValue(
          'ahmed.hassan@example.com'
        );


        // ----------------------------------------------------
        // Phone
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Phone 1',
              exact: true
            }
          )
        ).toHaveValue(
          '0501234567'
        );


        // ----------------------------------------------------
        // Role In Incident
        //
        // Current UI = SELECT / COMBOBOX
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'combobox',
            {
              name: 'Role In Incident 1',
              exact: true
            }
          )
        ).toHaveValue(
          'Accused'
        );
      }
    );


    // ========================================================
    // TC-042
    // Diagnostic validation test
    // ========================================================

    test(
      'TC-042 | Discover mandatory fields when person can be identified @diagnostic @validation',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);


        await navigateToPersonsInvolved(
          submit,
          notice
        );


        await submit.personsInvolved.selectCanIdentify(
          'Yes'
        );


        // ----------------------------------------------------
        // Do not fill the first person row.
        // ----------------------------------------------------

        await submit.personsInvolved.next();


        // ----------------------------------------------------
        // Navigation must remain on Person(s) Involved.
        // ----------------------------------------------------

        await verifyPersonsInvolvedLoaded(
          page
        );


        // ----------------------------------------------------
        // Capture any aria-invalid fields exposed by UI.
        // ----------------------------------------------------

        const invalidFields =
          page.locator(
            '[aria-invalid="true"]'
          );


        const invalidCount =
          await invalidFields.count();


        console.log(
          `Person mandatory field candidates: ${invalidCount}`
        );


        for (
          let index = 0;
          index < invalidCount;
          index++
        ) {

          const field =
            invalidFields.nth(index);


          console.log(
            `MANDATORY FIELD ${index + 1}:`,
            {
              ariaLabel:
                await field.getAttribute(
                  'aria-label'
                ),

              name:
                await field.getAttribute(
                  'name'
                ),

              id:
                await field.getAttribute(
                  'id'
                ),

              placeholder:
                await field.getAttribute(
                  'placeholder'
                )
            }
          );
        }


        // ----------------------------------------------------
        // Explicitly verify the known required fields remain
        // present on the blocked step.
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Full Name 1',
              exact: true
            }
          )
        ).toBeVisible();


        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Position 1',
              exact: true
            }
          )
        ).toBeVisible();


        await expect(
          page.getByRole(
            'textbox',
            {
              name: 'Company 1',
              exact: true
            }
          )
        ).toBeVisible();
      }
    );
  }
);