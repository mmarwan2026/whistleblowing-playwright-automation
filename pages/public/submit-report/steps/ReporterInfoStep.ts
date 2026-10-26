import { expect, Page } from '@playwright/test';
import { ReporterInfoData } from '../../../../models/public/ReporterData';

const ANONYMOUS_LABEL =
  "I Don't Wish to Disclose My Identity and Would Like to Stay Anonymous";

export class ReporterInfoStep {
  constructor(private readonly page: Page) {}

  private anonymousCheckbox() {
    return this.page.getByRole('checkbox', { name: ANONYMOUS_LABEL });
  }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', {
      name: 'Reporter Information', level: 2
    })).toBeVisible();
    await expect(this.anonymousCheckbox()).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  }

  async selectAnonymous(): Promise<void> {
    const checkbox = this.anonymousCheckbox();
    if (!(await checkbox.isChecked())) await checkbox.check();
    await expect(checkbox).toBeChecked();

    const modal = this.page.getByRole('dialog');
    const closeButton = this.page.getByRole('button', { name: 'Close', exact: true });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(modal).toBeHidden();
  }

  async selectIdentified(): Promise<void> {
    const checkbox = this.anonymousCheckbox();
    if (await checkbox.isChecked()) await checkbox.uncheck();
    await this.verifyIdentifiedFieldsVisible();
  }

  async selectReporterCategory(category: string): Promise<void> {
    const field = this.page.getByRole('combobox', { name: 'Reporter Category' });
    await expect(field).toBeVisible();
    await field.selectOption({ label: category });
    await expect(field).toHaveValue(category);
  }

  async verifyIdentifiedFieldsVisible(): Promise<void> {
    for (const field of ['First Name', 'Last Name', 'Company', 'Department', 'Position', 'Mobile', 'Email']) {
      await expect(this.page.getByRole('textbox', {
        name: new RegExp(`^${field}\\s*\\*?$`, 'i')
      })).toBeVisible();
    }
  }

  async fillIdentifiedReporter(data: ReporterInfoData): Promise<void> {
    const required: Array<keyof ReporterInfoData> = [
      'firstName', 'lastName', 'company', 'department', 'position', 'mobile', 'email'
    ];
    const missing = required.filter(field => !data[field]);
    if (missing.length) throw new Error(`Missing identified reporter data: ${missing.join(', ')}`);

    for (const [label, value] of [
      ['First Name', data.firstName], ['Last Name', data.lastName],
      ['Company', data.company], ['Department', data.department],
      ['Position', data.position], ['Mobile', data.mobile], ['Email', data.email]
    ] as const) {
      await this.page.getByRole('textbox', { name: new RegExp(`^${label}$`, 'i') }).fill(value!);
    }

    if (data.mobile) {
      const mobileChannel = this.page.getByRole('checkbox', { name: 'Mobile', exact: true });
      await mobileChannel.check();

      const countryCode = data.mobileCountryCode ?? data.mobile.match(/^\+(\d{3})/)?.[0];
      if (countryCode) {
        await this.page.getByRole('combobox', { name: 'Country Code', exact: true })
          .selectOption({ label: countryCode });
      }
    }

    if (data.email) {
      const emailChannel = this.page.getByRole('checkbox', { name: 'Email', exact: true });
      await emailChannel.check();
    }
  }

  async fill(data: ReporterInfoData): Promise<void> {
    if (data.identityType === 'anonymous') {
      await this.selectAnonymous();
      if (!data.reporterCategory) throw new Error('reporterCategory is required for anonymous reporter.');
      await this.selectReporterCategory(data.reporterCategory);
      return;
    }
    await this.selectIdentified();
    await this.fillIdentifiedReporter(data);
  }

  async next(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }
}
