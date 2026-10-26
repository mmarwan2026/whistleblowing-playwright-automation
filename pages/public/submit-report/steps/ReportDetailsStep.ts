import { expect, Page } from '@playwright/test';
import { ReportDetailsData } from '../../../../models/public/ReportDetailsData';

const CATEGORY_LABEL = /Select From the List Below the Category That Best Describes the Main Matter You Are Reporting/i;

export class ReportDetailsStep {
  constructor(private readonly page: Page) {}

  private category() {
    return this.page.getByRole('combobox', { name: CATEGORY_LABEL });
  }

  private incidentDescription() {
    return this.page.locator('#incidentdescrip');
  }

  private policyReference() {
    return this.page.locator('#whatrulepolicyo');
  }

  private awarenessMethod() {
    return this.page.locator('#howdidyoubecome');
  }

  private location() {
    return this.page.locator('#incidentlocatio');
  }

  private incidentDate() {
    return this.page.locator('#incidentdate');
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
    await expect(this.category()).toBeVisible();
    await expect(this.category()).toBeEnabled();
    await expect(this.incidentDescription()).toBeVisible();
    await expect(this.awarenessMethod()).toBeVisible();
    await expect(this.incidentDate()).toBeVisible();
    await expect(this.page.getByRole('radio', { name: 'Yes', exact: true })).toBeVisible();
    await expect(this.page.getByRole('radio', { name: 'No', exact: true })).toBeVisible();
    await expect(this.page.getByRole('radio', { name: 'Unknown', exact: true })).toBeVisible();
  }

  async fill(data: ReportDetailsData): Promise<void> {
    await expect(
      this.category().locator('option').filter({ hasText: data.category })
    ).toHaveCount(1, { timeout: 30000 });

    await this.category().selectOption({ label: data.category });
    await this.incidentDescription().fill(data.incidentDescription);
    if (data.policyReference) await this.policyReference().fill(data.policyReference);
    await this.awarenessMethod().fill(data.awarenessMethod);
    if (data.location) await this.location().fill(data.location);
    await this.incidentDate().fill(data.incidentDate);
    await this.page.getByRole('radio', { name: data.ongoing, exact: true }).check();
  }

  async next(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Person(s) Involved', level: 2 })).toBeVisible();
  }

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Reporter Information', level: 2 })).toBeVisible();
  }
}
