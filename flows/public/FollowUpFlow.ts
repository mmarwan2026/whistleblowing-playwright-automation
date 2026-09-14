import { Page } from '@playwright/test';
import { FollowUpCredentials } from '../../models/public/FollowUpCredentials';
import { FollowUpAccessPage } from '../../pages/public/follow-up/FollowUpAccessPage';
import { FollowUpCasePage } from '../../pages/public/follow-up/FollowUpCasePage';
import { FollowUpCommunicationPage } from '../../pages/public/follow-up/FollowUpCommunicationPage';

export class FollowUpFlow {
  readonly accessPage: FollowUpAccessPage;
  readonly casePage: FollowUpCasePage;
  readonly communicationPage: FollowUpCommunicationPage;

  constructor(page: Page) {
    this.accessPage = new FollowUpAccessPage(page);
    this.casePage = new FollowUpCasePage(page);
    this.communicationPage = new FollowUpCommunicationPage(page);
  }

  async accessCase(credentials: FollowUpCredentials) {
    await this.accessPage.open();
    await this.accessPage.access(credentials);
    await this.casePage.expectLoaded();
  }
}
