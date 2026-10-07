import {
  expect,
  Page
} from '@playwright/test';

import {
  ReporterInfoData
} from '../../../../models/public/ReporterData';


export class ReporterInfoStep {

  constructor(
    private readonly page: Page
  ) { }


  // ==========================================================
  // VERIFY LOADED
  // ==========================================================

  async verifyLoaded(): Promise<void> {

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

  async selectAnonymous(): Promise<void> {

    const anonymousRadio =
      this.page.getByRole('radio', {
        name: 'Remain anonymous'
      });

    await anonymousRadio.check();

    await expect(
      anonymousRadio
    ).toBeChecked();

    // Anonymous information modal is expected
    // after selecting "Remain anonymous".
    await this.handleAnonymousWarningModal();
  }


  async selectIdentified(): Promise<void> {

    const identifiedRadio =
      this.page.getByRole('radio', {
        name: 'Disclose my identity'
      });

    await identifiedRadio.check();

    await expect(
      identifiedRadio
    ).toBeChecked();

    await this.verifyIdentifiedFieldsVisible();
  }


  // ==========================================================
  // ANONYMOUS WARNING MODAL
  // ==========================================================

  private async handleAnonymousWarningModal():
    Promise<void> {

    const modalHeading =
      this.page.getByRole('heading', {
        name: 'Before You Continue Anonymously',
        exact: true
      });

    await expect(
      modalHeading
    ).toBeVisible();

    const closeButton =
      this.page.getByRole('button', {
        name: 'Close',
        exact: true
      });

    await expect(
      closeButton
    ).toBeVisible();

    await expect(
      closeButton
    ).toBeEnabled();

    await closeButton.click();

    await expect(
      modalHeading
    ).toBeHidden();
  }


  // ==========================================================
  // ANONYMOUS REPORTER
  // ==========================================================

  async selectReporterCategory(
    category: string
  ): Promise<void> {

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

    await expect(
      reporterCategory
    ).toHaveValue(
      await reporterCategory.inputValue()
    );
  }


  // ==========================================================
  // IDENTIFIED REPORTER
  // ==========================================================

  async verifyIdentifiedFieldsVisible():
    Promise<void> {

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
          name: new RegExp(
            `^${field}\\s*\\*?$`,
            'i'
          )
        })
      ).toBeVisible();
    }
  }


  async fillIdentifiedReporter(
    data: ReporterInfoData
  ): Promise<void> {

    this.validateIdentifiedReporter(
      data
    );

    await this.page
      .getByRole('textbox', {
        name: /First Name/i
      })
      .fill(data.firstName!);

    await this.page
      .getByRole('textbox', {
        name: /Last Name/i
      })
      .fill(data.lastName!);

    await this.page
      .getByRole('textbox', {
        name: /Company/i
      })
      .fill(data.company!);

    await this.page
      .getByRole('textbox', {
        name: /Department/i
      })
      .fill(data.department!);

    await this.page
      .getByRole('textbox', {
        name: /Position/i
      })
      .fill(data.position!);

    await this.page
      .getByRole('textbox', {
        name: /Mobile/i
      })
      .fill(data.mobile!);

    await this.page
      .getByRole('textbox', {
        name: /Email/i
      })
      .fill(data.email!);
  }


  // ==========================================================
  // COMMON FILL
  // ==========================================================

  async fill(
    data: ReporterInfoData
  ): Promise<void> {

    if (
      data.identityType === 'anonymous'
    ) {

      await this.selectAnonymous();

      if (!data.reporterCategory) {
        throw new Error(
          'reporterCategory is required for anonymous reporter.'
        );
      }

      await this.selectReporterCategory(
        data.reporterCategory
      );

      return;
    }

    await this.selectIdentified();

    await this.fillIdentifiedReporter(
      data
    );
  }


  // ==========================================================
  // VALIDATION
  // ==========================================================

  private validateIdentifiedReporter(
    data: ReporterInfoData
  ): void {

    const requiredFields: Array<
      keyof ReporterInfoData
    > = [
        'firstName',
        'lastName',
        'company',
        'department',
        'position',
        'mobile',
        'email'
      ];

    const missingFields =
      requiredFields.filter(
        field => !data[field]
      );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing identified reporter data: ${missingFields.join(', ')}`
      );
    }
  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  async next(): Promise<void> {

    const nextButton =
      this.page.getByRole('button', {
        name: 'Next',
        exact: true
      });

    await expect(
      nextButton
    ).toBeEnabled();

    await nextButton.click();
  }


  async back(): Promise<void> {

    const backButton =
      this.page.getByRole('button', {
        name: 'Back',
        exact: true
      });

    await expect(
      backButton
    ).toBeVisible();

    await backButton.click();
  }
}