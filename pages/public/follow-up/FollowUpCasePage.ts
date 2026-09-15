import { expect, Page } from '@playwright/test';

export class FollowUpCasePage {

  constructor(
    private readonly page: Page
  ) {}

  // ==========================================================
  // VERIFY CASE PAGE LOADED
  // ==========================================================

 async expectLoaded() {

  await expect(
    this.page.getByRole('heading', {
      name: 'Your case',
      level: 1
    })
  ).toBeVisible();

  await expect(
    this.page.getByText(
      'Credentials accepted.',
      {
        exact: false
      }
    )
  ).toBeVisible();

  await expect(
    this.page.getByRole('button', {
      name: 'Check another case',
      exact: true
    })
  ).toBeVisible();

  await expect(
    this.page.getByRole('heading', {
      name: 'Secure Mailbox',
      level: 2
    })
  ).toBeVisible();
}

  // ==========================================================
  // VERIFY REFERENCE NUMBER
  // ==========================================================

  async expectReferenceNumber(
    referenceNumber: string
  ) {

    await expect(
      this.page.getByText(
        referenceNumber,
        {
          exact: true
        }
      )
    ).toBeVisible();
  }

  // ==========================================================
  // VERIFY REPORT STATUS
  // ==========================================================

  async expectStatus(
    status: string
  ) {

    await expect(
      this.page.getByText(
        status,
        {
          exact: true
        }
      )
    ).toBeVisible();
  }

  // ==========================================================
  // VERIFY SECURE MAILBOX
  // ==========================================================

  async expectSecureMailboxVisible() {

    await expect(
      this.page.getByRole('heading', {
        name: 'Secure Mailbox'
      })
    ).toBeVisible();
  }
}