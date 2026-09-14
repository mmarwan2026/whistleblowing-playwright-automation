import { Page } from '@playwright/test';
import { PreviousReportingData } from '../../../../models/public/PreviousReportingData';

export class PreviousReportingStep {
  constructor(private readonly page: Page) {}

  async fill(data: PreviousReportingData) {
    const choice = data.reportedBefore ? /yes/i : /no/i;
    await this.page.getByRole('radio', { name: choice }).click();

    if (data.reportedBefore && data.details) {
      await this.page.getByLabel(/details|previous/i).fill(data.details);
    }
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
