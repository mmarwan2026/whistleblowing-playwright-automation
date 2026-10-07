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
  ): Promise<void> {

    // ========================================================
    // STEP 1 - OPEN FOLLOW-UP
    // ========================================================

    await this.accessPage.open();

    await this.accessPage
      .verifyLoaded();

    // ========================================================
    // STEP 2 - ENTER REFERENCE NUMBER
    // ========================================================

    await this.accessPage
      .fillReferenceNumber(
        credentials.referenceNumber
      );

    // ========================================================
    // STEP 3 - ENTER ACCESS KEY / PIN
    //
    // Never log the PIN / Access Key.
    // ========================================================

    await this.accessPage
      .fillAccessKey(
        credentials.pin
      );

    // ========================================================
    // STEP 4 - VERIFY ENTERED CREDENTIALS
    // ========================================================

    await this.accessPage
      .verifyCredentialsEntered(
        credentials
      );

    // ========================================================
    // STEP 5 - ACCESS CASE
    // ========================================================

    await this.accessPage
      .clickAccessMyCase();

    // ========================================================
    // STEP 6 - VERIFY CASE PAGE
    // ========================================================

    await this.casePage
      .expectLoaded();

    // ========================================================
    // STEP 7 - VERIFY SAME SUBMITTED CASE
    //
    // Critical lifecycle assertion:
    // Follow-up must open the exact report created during
    // anonymous submission.
    // ========================================================

    await this.casePage
      .expectReferenceNumber(
        credentials.referenceNumber
      );
  }
}