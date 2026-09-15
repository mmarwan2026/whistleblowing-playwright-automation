import {
  expect,
  Page
} from '@playwright/test';

import {
  Routes
} from '../../../config/urls';

import {
  FollowUpCredentials
} from '../../../models/public/FollowUpCredentials';

export class FollowUpAccessPage {

  constructor(
    private readonly page: Page
  ) {}

  // ==========================================================
  // OPEN FOLLOW-UP PAGE
  // ==========================================================

  async open() {

    await this.page.goto(
      Routes.public.followUp
    );

    await this.verifyLoaded();
  }

  // ==========================================================
  // VERIFY PAGE LOADED
  // ==========================================================

  async verifyLoaded() {

    await expect(
      this.page.getByRole('heading', {
        name: 'Follow Up on a Report',
        level: 1
      })
    ).toBeVisible();

    await expect(
      this.page.getByLabel(
        'Case Reference Number',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByLabel(
        'Access Key',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Access My Case',
        exact: true
      })
    ).toBeVisible();
  }

  // ==========================================================
  // FILL REFERENCE NUMBER
  // ==========================================================

  async fillReferenceNumber(
    referenceNumber: string
  ) {

    const referenceInput =
      this.page.getByLabel(
        'Case Reference Number',
        {
          exact: true
        }
      );

    await expect(
      referenceInput
    ).toBeVisible();

    await referenceInput.fill(
      referenceNumber
    );

    await expect(
      referenceInput
    ).toHaveValue(
      referenceNumber
    );
  }

  // ==========================================================
  // FILL ACCESS KEY
  // ==========================================================

  async fillAccessKey(
    accessKey: string
  ) {

    const accessKeyInput =
      this.page.getByLabel(
        'Access Key',
        {
          exact: true
        }
      );

    await expect(
      accessKeyInput
    ).toBeVisible();

    await accessKeyInput.fill(
      accessKey
    );

    await expect(
      accessKeyInput
    ).toHaveValue(
      accessKey
    );
  }

  // ==========================================================
  // VERIFY ENTERED CREDENTIALS
  // ==========================================================

  async verifyCredentialsEntered(
    credentials: FollowUpCredentials
  ) {

    const referenceInput =
      this.page.getByLabel(
        'Case Reference Number',
        {
          exact: true
        }
      );

    const accessKeyInput =
      this.page.getByLabel(
        'Access Key',
        {
          exact: true
        }
      );

    await expect(
      referenceInput
    ).toHaveValue(
      credentials.referenceNumber
    );

    await expect(
      accessKeyInput
    ).toHaveValue(
      credentials.pin
    );
  }

  // ==========================================================
  // ACCESS MY CASE
  // ==========================================================

  async clickAccessMyCase() {

    const accessButton =
      this.page.getByRole('button', {
        name: 'Access My Case',
        exact: true
      });

    await expect(
      accessButton
    ).toBeVisible();

    await expect(
      accessButton
    ).toBeEnabled();

    await accessButton.click();
  }

  // ==========================================================
  // COMPLETE ACCESS
  // ==========================================================

  async access(
    credentials: FollowUpCredentials
  ) {

    await this.fillReferenceNumber(
      credentials.referenceNumber
    );

    await this.fillAccessKey(
      credentials.pin
    );

    await this.verifyCredentialsEntered(
      credentials
    );

    await this.clickAccessMyCase();
  }
}