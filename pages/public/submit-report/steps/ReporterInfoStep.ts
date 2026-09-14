import { Page, expect } from '@playwright/test';
import { ReporterInfoData } from '../../../../models/public/ReporterData';
import { Dropdown } from '../../../../components/common/Dropdown';

export class ReporterInfoStep {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(
      this.page.getByText('Reporter Info', { exact: true })
    ).toBeVisible();
  }

  async fill(data: ReporterInfoData) {
    if (data.identityType === 'anonymous') {
      await this.page.getByText('Remain anonymous', { exact: true }).click();
    } else {
      await this.page.getByText('Disclose my identity', { exact: true }).click();
    }

    const reporterCategory = this.page.getByLabel('Reporter Category');
    await new Dropdown(this.page, reporterCategory).select(data.reporterCategory);
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }

  async back() {
    await this.page.getByRole('button', { name: 'Back' }).click();
  }
}
