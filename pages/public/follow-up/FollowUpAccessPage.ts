import { Page } from '@playwright/test';
import { Routes } from '../../../config/urls';
import { FollowUpCredentials } from '../../../models/public/FollowUpCredentials';

export class FollowUpAccessPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto(Routes.public.followUp);
  }

  async access(credentials: FollowUpCredentials) {
    // TODO: confirm exact labels.
    await this.page.getByLabel(/reference/i).fill(credentials.referenceNumber);
    await this.page.getByLabel(/pin/i).fill(credentials.pin);
    await this.page.getByRole('button', { name: /access|continue|submit/i }).click();
  }
}
