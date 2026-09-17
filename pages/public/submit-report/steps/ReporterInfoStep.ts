import { expect, Page } from '@playwright/test';
import { ReporterInfoData } from '../../../../models/public/ReporterData';

export class ReporterInfoStep {
  constructor(private readonly page: Page) {}

async verifyLoaded() {
  await expect(
    this.page.getByText('Loading the report form…', { exact: true })
  ).toBeHidden();

  await expect(
    this.page.getByRole('heading', {
      name: 'Reporter Info',
      level: 2
    })
  ).toBeVisible();

  await expect(
    this.page.getByRole('radio', {
      name: 'Disclose my identity'
    })
  ).toBeVisible();

  await expect(
    this.page.getByRole('radio', {
      name: 'Remain anonymous'
    })
  ).toBeVisible();
}

  async selectAnonymous() {
    await this.page
      .getByRole('radio', {
        name: 'Remain anonymous'
      })
      .check();

  /*  await expect(
      this.page.getByText(
        'Before You Continue Anonymously',
        { exact: true }
      )
    ).toBeVisible();

    await this.page
      .getByRole('button', {
        name: 'Close'
      })
      .click();

    await expect(
      this.page.getByText(
        'Before You Continue Anonymously',
        { exact: true }
      )
    ).toBeHidden();*/
  }

  async selectIdentified() {
    await this.page
      .getByRole('radio', {
        name: 'Disclose my identity'
      })
      .check();
  }

  async selectReporterCategory(category: string) {
    const reporterCategory = this.page.getByRole(
      'combobox',
      {
        name: 'Reporter Category'
      }
    );

    await expect(reporterCategory).toBeVisible();

    await reporterCategory.selectOption({
      label: category
    });
  }

  async fill(data: ReporterInfoData) {
    if (data.identityType === 'anonymous') {
      await this.selectAnonymous();
    } else {
      await this.selectIdentified();
    }

    await this.selectReporterCategory(
      data.reporterCategory
    );
  }

  async next() {
    const nextButton = this.page.getByRole(
      'button',
      {
        name: 'Next'
      }
    );

    await expect(nextButton).toBeEnabled();

    await nextButton.click();
  }

  async back() {
    await this.page
      .getByRole('button', {
        name: 'Back'
      })
      .click();
  }
}