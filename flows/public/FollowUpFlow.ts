import {
  Page
} from '@playwright/test';

import {
  FollowUpCredentials
} from '../../models/public/FollowUpCredentials';

import {
  FollowUpAccessPage
} from '../../pages/public/follow-up/FollowUpAccessPage';

import {
  FollowUpCasePage
} from '../../pages/public/follow-up/FollowUpCasePage';

import {
  FollowUpCommunicationPage
} from '../../pages/public/follow-up/FollowUpCommunicationPage';

export class FollowUpFlow {

  readonly accessPage:
    FollowUpAccessPage;

  readonly casePage:
    FollowUpCasePage;

  readonly communicationPage:
    FollowUpCommunicationPage;

  constructor(
    page: Page
  ) {

    this.accessPage =
      new FollowUpAccessPage(page);

    this.casePage =
      new FollowUpCasePage(page);

    this.communicationPage =
      new FollowUpCommunicationPage(page);
  }

  // ==========================================================
  // ACCESS CASE
  // ==========================================================

  async accessCase(
    credentials: FollowUpCredentials
  ) {

    // --------------------------------------------------------
    // 1. Open Follow-up page
    // --------------------------------------------------------

    await this.accessPage.open();

    // --------------------------------------------------------
    // 2. Enter generated Reference Number
    // --------------------------------------------------------

    await this.accessPage.fillReferenceNumber(
      credentials.referenceNumber
    );

    // --------------------------------------------------------
    // 3. Enter generated Access Key / PIN
    // --------------------------------------------------------

    await this.accessPage.fillAccessKey(
      credentials.pin
    );

    // --------------------------------------------------------
    // 4. Verify exactly what Playwright entered
    //
    // Important:
    // Never log the PIN / Access Key.
    // --------------------------------------------------------

    await this.accessPage.verifyCredentialsEntered(
      credentials
    );

    // --------------------------------------------------------
    // 5. Submit Follow-up credentials
    // --------------------------------------------------------

    await this.accessPage.clickAccessMyCase();

    // --------------------------------------------------------
    // 6. Verify successful case access
    // --------------------------------------------------------

    await this.casePage.expectLoaded();

    // --------------------------------------------------------
    // 7. CRITICAL LIFECYCLE ASSERTION
    //
    // The case displayed after Follow-up MUST be the same case
    // created during anonymous submission.
    //
    // Do not remove this assertion.
    // --------------------------------------------------------

    await this.casePage.expectReferenceNumber(
      credentials.referenceNumber
    );
  }
}