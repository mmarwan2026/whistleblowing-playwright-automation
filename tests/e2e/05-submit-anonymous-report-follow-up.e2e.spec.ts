import { test } from '@playwright/test';

import {
  ReportFactory
} from '../../data/factories/ReportFactory';

import {
  AnonymousReportFlow
} from '../../flows/public/AnonymousReportFlow';

import {
  FollowUpFlow
} from '../../flows/public/FollowUpFlow';

test.describe(
  'Anonymous Report Lifecycle - E2E',
  () => {

    test(
      'E2E-004 | Anonymous reporter can submit report and access it through follow-up @e2e @public @followup',
      async ({ browser }) => {

        // =====================================================
        // STEP 1 - CREATE SUBMISSION SESSION
        // =====================================================

        const submitContext =
          await browser.newContext();

        let referenceNumber: string;
        let pin: string;

        try {
          const submitPage =
            await submitContext.newPage();

          // ===================================================
          // STEP 2 - SUBMIT ANONYMOUS REPORT
          // ===================================================

          const result =
            await new AnonymousReportFlow(
              submitPage
            ).submit(
              ReportFactory.anonymous()
            );

          referenceNumber =
            result.referenceNumber;

          pin =
            result.pin;

        } finally {

          // ===================================================
          // STEP 3 - CLOSE SUBMISSION SESSION
          // ===================================================

          await submitContext.close();
        }

        // =====================================================
        // STEP 4 - CREATE INDEPENDENT FOLLOW-UP SESSION
        //
        // A new browser context guarantees that follow-up does
        // not depend on cookies/session state from submission.
        // =====================================================

        const followContext =
          await browser.newContext();

        try {
          const followPage =
            await followContext.newPage();

          // ===================================================
          // STEP 5 - ACCESS SUBMITTED REPORT
          // ===================================================

          await new FollowUpFlow(
            followPage
          ).accessCase({
            referenceNumber,
            pin
          });

        } finally {

          // ===================================================
          // STEP 6 - CLOSE FOLLOW-UP SESSION
          // ===================================================

          await followContext.close();
        }
      }
    );
  }
);