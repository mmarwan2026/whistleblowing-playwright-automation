import {
    test,
    expect,
    Page,
    Browser
} from '@playwright/test';
import { LoginFlow } from '../../../flows/staff/LoginFlow';
import { CaseSimilarityPage } from '../../../pages/staff/case-similarity/CaseSimilarityPage';
import {
    SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
    ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';

import {
    SimilarityBaseReport,
    ExactDuplicateReport,
    SemanticParaphraseReport,
    DifferentPersonReport,
    NoPersonReport,
    DifferentClassificationReport,
    DifferentSubcategoryReport,
    DifferentTitleReport,
    DifferentDescriptionReport,
    DifferentPersonNameReport,
    DifferentPersonEmailReport,
    DifferentPersonPhoneReport,
    DifferentPersonPositionReport,
    DifferentPersonCompanyReport,
    DifferentPersonDepartmentReport,
    DifferentPersonRoleReport,
    DifferentPersonContactReport,
    DifferentPersonIdentityReport,
    DifferentPersonNamePositionReport,
    DifferentPersonNameDepartmentReport,
    DifferentPersonPositionDepartmentReport,
    DifferentPersonEmploymentReport,
    DifferentPersonNamePositionDepartmentReport,
    DifferentPersonProfileReport,
    CompletelyDifferentPersonReport,
    NoSharedPersonTokensReport,
    ExactNameOnlyReport,
    ExactEmailOnlyReport,
    ExactPhoneOnlyReport,
    ExactPositionOnlyReport,
    ExactCompanyOnlyReport,
    ExactDepartmentOnlyReport,
    ExactRoleOnlyReport
} from '../../../data/similarity/SimilarityBenchmarkData';

import {
    submitAndValidate,
    SubmitReportResult
} from '../../../helpers/public/submitReportAssertions';

import {
    ReportData
} from '../../../models/public/ReportData';


/**
 * ============================================================
 * SUBMIT SINGLE REPORT
 * ============================================================
 */
async function submitReport(
    page: Page,
    data: ReportData,
    testId: string
): Promise<SubmitReportResult> {

    const submit =
        new SubmitReportPage(page);

    const notice =
        new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    await submit.reporterInfo.verifyLoaded();
    await submit.reporterInfo.fill(data.reporter);
    await submit.reporterInfo.next();

    await submit.classification.verifyLoaded();
    await submit.classification.fill(data.classification);
    await submit.classification.next();

    await submit.allegation.verifyLoaded();
    await submit.allegation.fill(data.allegation);
    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
    await submit.personsInvolved.fill(data.personsInvolved);
    await submit.personsInvolved.next();

    await submit.witnesses.verifyLoaded();
    await submit.witnesses.fill(data.witnesses);
    await submit.witnesses.next();

    await submit.evidence.verifyLoaded();
    await submit.evidence.fill(data.evidence);
    await submit.evidence.next();

    await submit.previousReporting.verifyLoaded();

    await submit.previousReporting.selectPreviouslyReported(
        data.previousReporting.previouslyReported
    );

    await submit.previousReporting.next();

    await submit.declaration.verifyLoaded();
    await submit.declaration.acceptAllAcknowledgements();

    return submitAndValidate(
        page,
        submit,
        testId
    );
}


/**
 * ============================================================
 * SUBMIT CONTROLLED PAIR
 * ============================================================
 */
async function submitPair(
    browser: Browser,
    baseData: ReportData,
    comparisonData: ReportData,
    baseId: string,
    comparisonId: string
): Promise<{
    base: SubmitReportResult;
    comparison: SubmitReportResult;
}> {

    const baseContext =
        await browser.newContext();

    let base: SubmitReportResult;

    try {

        const page =
            await baseContext.newPage();

        base =
            await submitReport(
                page,
                baseData,
                baseId
            );

    } finally {

        await baseContext.close();
    }


    const comparisonContext =
        await browser.newContext();

    let comparison: SubmitReportResult;

    try {

        const page =
            await comparisonContext.newPage();

        comparison =
            await submitReport(
                page,
                comparisonData,
                comparisonId
            );

    } finally {

        await comparisonContext.close();
    }


    expect(base.reference).toBeTruthy();
    expect(comparison.reference).toBeTruthy();

    expect(
        comparison.reference
    ).not.toBe(
        base.reference
    );

    return {
        base,
        comparison
    };
}


/**
 * ============================================================
 * RUN SCENARIO
 * ============================================================
 */
async function runSimilarityScenario(
    browser: Browser,
    testId: string,
    comparisonData: ReportData,
    comparisonName: string
): Promise<{
    base: SubmitReportResult;
    comparison: SubmitReportResult;
}> {

    const result =
        await submitPair(
            browser,
            SimilarityBaseReport,
            comparisonData,
            `${testId}-BASE`,
            `${testId}-${comparisonName}`
        );

    console.log(
        `${testId} Base Reference:`,
        result.base.reference
    );

    console.log(
        `${testId} Comparison Reference:`,
        result.comparison.reference
    );

    return result;
}


/**
 * ============================================================
 * AI CASE SIMILARITY
 * ============================================================
 */
test.describe(
    'AI Case Similarity - E2E',
    () => {

        test(
            'AI-SIM-001 | Exact duplicate reports @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-001',
                    ExactDuplicateReport,
                    'DUPLICATE'
                );
            }
        );


        test(
            'AI-SIM-002 | Semantic paraphrase @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-002',
                    SemanticParaphraseReport,
                    'SEMANTIC'
                );
            }
        );


        test(
            'AI-SIM-003 | Different involved person @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-003',
                    DifferentPersonReport,
                    'DIFFERENT-PERSON'
                );
            }
        );


        test(
            'AI-SIM-004 | No involved person @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-004',
                    NoPersonReport,
                    'NO-PERSON'
                );
            }
        );


        test(
            'AI-SIM-005 | Different category and subcategory @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-005',
                    DifferentClassificationReport,
                    'DIFFERENT-CLASSIFICATION'
                );
            }
        );


        test(
            'AI-SIM-006 | Different subcategory only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-006',
                    DifferentSubcategoryReport,
                    'DIFFERENT-SUBCATEGORY'
                );
            }
        );


        test(
            'AI-SIM-007 | Different report title only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-007',
                    DifferentTitleReport,
                    'DIFFERENT-TITLE'
                );
            }
        );


        test(
            'AI-SIM-008 | Different incident description only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-008',
                    DifferentDescriptionReport,
                    'DIFFERENT-DESCRIPTION'
                );
            }
        );


        test(
            'AI-SIM-009 | Different person name only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-009',
                    DifferentPersonNameReport,
                    'DIFFERENT-PERSON-NAME'
                );
            }
        );


        test(
            'AI-SIM-010 | Different person email only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-010',
                    DifferentPersonEmailReport,
                    'DIFFERENT-PERSON-EMAIL'
                );
            }
        );


        test(
            'AI-SIM-011 | Different person phone only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-011',
                    DifferentPersonPhoneReport,
                    'DIFFERENT-PERSON-PHONE'
                );
            }
        );


        test(
            'AI-SIM-012 | Different person position only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-012',
                    DifferentPersonPositionReport,
                    'DIFFERENT-PERSON-POSITION'
                );
            }
        );


        test(
            'AI-SIM-013 | Different person company only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-013',
                    DifferentPersonCompanyReport,
                    'DIFFERENT-PERSON-COMPANY'
                );
            }
        );


        test(
            'AI-SIM-014 | Different person department only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-014',
                    DifferentPersonDepartmentReport,
                    'DIFFERENT-PERSON-DEPARTMENT'
                );
            }
        );


        test(
            'AI-SIM-015 | Different person role only @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-015',
                    DifferentPersonRoleReport,
                    'DIFFERENT-PERSON-ROLE'
                );
            }
        );


        test(
            'AI-SIM-016 | Different person email and phone @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-016',
                    DifferentPersonContactReport,
                    'DIFFERENT-PERSON-CONTACT'
                );
            }
        );


        test(
            'AI-SIM-017 | Different person name email and phone @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-017',
                    DifferentPersonIdentityReport,
                    'DIFFERENT-PERSON-IDENTITY'
                );
            }
        );


        test(
            'AI-SIM-018 | Different person name and position @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-018',
                    DifferentPersonNamePositionReport,
                    'DIFFERENT-NAME-POSITION'
                );
            }
        );


        test(
            'AI-SIM-019 | Different person name and department @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-019',
                    DifferentPersonNameDepartmentReport,
                    'DIFFERENT-NAME-DEPARTMENT'
                );
            }
        );


        test(
            'AI-SIM-020 | Different person position and department @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-020',
                    DifferentPersonPositionDepartmentReport,
                    'DIFFERENT-POSITION-DEPARTMENT'
                );
            }
        );


        test(
            'AI-SIM-021 | Different person position company and department @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-021',
                    DifferentPersonEmploymentReport,
                    'DIFFERENT-EMPLOYMENT'
                );
            }
        );


        test(
            'AI-SIM-022 | Different person name position and department @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-022',
                    DifferentPersonNamePositionDepartmentReport,
                    'DIFFERENT-NAME-POSITION-DEPARTMENT'
                );
            }
        );


        test(
            'AI-SIM-023 | Different person name position company and department @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-023',
                    DifferentPersonProfileReport,
                    'DIFFERENT-PERSON-PROFILE'
                );
            }
        );


        test(
            'AI-SIM-024 | All involved person fields different with shared name token @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-024',
                    CompletelyDifferentPersonReport,
                    'COMPLETELY-DIFFERENT-PERSON'
                );
            }
        );


        /**
         * ========================================================
         * AI-SIM-025
         *
         * Critical isolation scenario.
         *
         * Base person:
         * Ahmed Similarity <runId>
         *
         * Comparison person:
         * Omar Khaled Hassan
         *
         * No runId/shared token in comparison person's name.
         *
         * All other report-level similarity attributes remain
         * controlled and identical.
         * ========================================================
         */
        test(
            'AI-SIM-025 | Completely different person with no shared name tokens @e2e @public @case-similarity',
            async ({ browser }) => {

                await runSimilarityScenario(
                    browser,
                    'AI-SIM-025',
                    NoSharedPersonTokensReport,
                    'NO-SHARED-PERSON-TOKENS'
                );
            }
        );

    }
);
test(
    'AI-SIM-026 | Exact name with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-026',
            ExactNameOnlyReport,
            'EXACT-NAME-ONLY'
        );
    }
);
test(
    'AI-SIM-027 | Exact email only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-027',
            ExactEmailOnlyReport,
            'EXACT-EMAIL-ONLY'
        );
    }
);


test(
    'AI-SIM-028 | Exact phone only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-028',
            ExactPhoneOnlyReport,
            'EXACT-PHONE-ONLY'
        );
    }
);


test(
    'AI-SIM-029 | Exact position only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-029',
            ExactPositionOnlyReport,
            'EXACT-POSITION-ONLY'
        );
    }
);


test(
    'AI-SIM-030 | Exact company only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-030',
            ExactCompanyOnlyReport,
            'EXACT-COMPANY-ONLY'
        );
    }
);


test(
    'AI-SIM-031 | Exact department only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        await runSimilarityScenario(
            browser,
            'AI-SIM-031',
            ExactDepartmentOnlyReport,
            'EXACT-DEPARTMENT-ONLY'
        );
    }
);


test(
    'AI-SIM-032 | Exact role only with all other person fields different @e2e @public @case-similarity',
    async ({ browser }) => {
        const submission = await runSimilarityScenario(
            browser,
            'AI-SIM-032',
            ExactRoleOnlyReport,
            'EXACT-ROLE-ONLY'
        );

        await readSimilarityResult(
            browser,
            submission.comparison.reference,
            submission.base.reference
        );
    }
);
async function readSimilarityResult(
    browser: Browser,
    comparisonReference: string,
    baseReference: string
) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const email = process.env.STAFF_USERNAME;
        const password = process.env.STAFF_PASSWORD;

        expect(
            email,
            'STAFF_USERNAME must be configured'
        ).toBeTruthy();

        expect(
            password,
            'STAFF_PASSWORD must be configured'
        ).toBeTruthy();

        const login = new LoginFlow(page);

        await login.login(
            email!,
            password!
        );

        /*
         * TEMPORARY:
         * Navigate through My Workspace until we create
         * a dedicated Staff Workspace POM.
         */

        await page
            .getByRole('link', { name: 'My Workspace' })
            .click();

        /*
         * Search for the newly submitted comparison report.
         */
        const workspaceSearch = page.getByRole(
            'textbox',
            { name: 'Search...' }
        );

        await expect(workspaceSearch).toBeVisible();

        await workspaceSearch.fill(comparisonReference);

        /*
         * Open the task returned by the search.
         */
        const openTask = page.getByRole('button', {
            name: 'Open Task'
        });

        await expect(openTask.first()).toBeVisible();

        await openTask.first().click();

        /*
         * Based on the currently recorded workflow,
         * Case Similarity becomes available from the task.
         *
         * Do NOT click Complete Task automatically here.
         * Reading similarity should not mutate workflow state.
         */

        const similarityPage =
            new CaseSimilarityPage(page);

        await similarityPage.open();

        const result =
            await similarityPage.searchAndGetResult(
                baseReference
            );

        console.log('');
        console.log('================================');
        console.log('CASE SIMILARITY RESULT');
        console.log('================================');
        console.log('Comparison :', comparisonReference);
        console.log('Base       :', baseReference);
        console.log('Person Match:', result.personMatch);
        console.log('Match Type  :', result.matchType || '-');
        console.log('Current     :', result.currentPerson || '-');
        console.log('Matched     :', result.matchedPerson || '-');
        console.log('Score       :', result.score);
        console.log('Level       :', result.level);
        console.log('================================');
        console.log('');

        return result;
    } finally {
        await context.close();
    }
}