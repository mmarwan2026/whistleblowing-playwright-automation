import { expect, Page } from '@playwright/test';
import { ReporterInfoData } from '../../../../models/public/ReporterData';

export class ReporterInfoStep {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
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

  // ==========================================================
  // IDENTITY TYPE
  // ==========================================================

  async selectAnonymous() {
    await this.page
      .getByRole('radio', {
        name: 'Remain anonymous'
      })
      .check();

    await expect(
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
    ).toBeHidden();
  }

  async selectIdentified() {
    await this.page
      .getByRole('radio', {
        name: 'Disclose my identity'
      })
      .check();

    await this.verifyIdentifiedFieldsVisible();
  }

  // ==========================================================
  // ANONYMOUS REPORTER
  // ==========================================================

  async selectReporterCategory(category: string) {
    const reporterCategory =
      this.page.getByRole('combobox', {
        name: 'Reporter Category'
      });

    await expect(
      reporterCategory
    ).toBeVisible();

    await reporterCategory.selectOption({
      label: category
    });
  }

  // ==========================================================
  // IDENTIFIED REPORTER
  // ==========================================================

  async verifyIdentifiedFieldsVisible() {
    const fields = [
      'First Name',
      'Last Name',
      'Company',
      'Department',
      'Position',
      'Mobile',
      'Email'
    ];

    for (const field of fields) {
      await expect(
        this.page.getByRole('textbox', {
          name: new RegExp(`^${field}\\s*\\*?$`, 'i')
        })
      ).toBeVisible();
    }
  }

  async fillIdentifiedReporter(
    data: ReporterInfoData
  ) {
    if (data.firstName) {
      await this.page
        .getByRole('textbox', {
          name: /First Name/i
        })
        .fill(data.firstName);
    }

    if (data.lastName) {
      await this.page
        .getByRole('textbox', {
          name: /Last Name/i
        })
        .fill(data.lastName);
    }

    if (data.company) {
      await this.page
        .getByRole('textbox', {
          name: /Company/i
        })
        .fill(data.company);
    }

    if (data.department) {
      await this.page
        .getByRole('textbox', {
          name: /Department/i
        })
        .fill(data.department);
    }

    if (data.position) {
      await this.page
        .getByRole('textbox', {
          name: /Position/i
        })
        .fill(data.position);
    }

    if (data.mobile) {
      await this.page
        .getByRole('textbox', {
          name: /Mobile/i
        })
        .fill(data.mobile);
    }

    if (data.email) {
      await this.page
        .getByRole('textbox', {
          name: /Email/i
        })
        .fill(data.email);
    }
  }

  // ==========================================================
  // COMMON FILL
  // ==========================================================

  async fill(data: ReporterInfoData) {
    if (data.identityType === 'anonymous') {
      await this.selectAnonymous();

      if (!data.reporterCategory) {
        throw new Error(
          'reporterCategory is required for anonymous reporter'
        );
      }

      await this.selectReporterCategory(
        data.reporterCategory
      );

      return;
    }

    await this.selectIdentified();

    await this.fillIdentifiedReporter(data);
  }

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  async next() {
    const nextButton =
      this.page.getByRole('button', {
        name: 'Next'
      });

    await expect(
      nextButton
    ).toBeEnabled();

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