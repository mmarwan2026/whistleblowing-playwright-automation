import { expect, Page } from '@playwright/test';
import { getEnvironment } from '../../config/environments';

export class LoginPage {
  constructor(private readonly page: Page) { }

  async open(): Promise<void> {
    const staffUrl =
      getEnvironment().staffUrl.replace(/\/+$/, '');

    await this.page.goto(`${staffUrl}/login`);

    await expect(
      this.page.locator('input[type="password"]')
    ).toBeVisible();
  }

  async login(
    email: string,
    password: string
  ): Promise<void> {
    const emailInput = this.page
      .getByLabel(/email|username/i)
      .or(
        this.page.locator(
          'input[type="email"], input[name*="email" i], input[name*="user" i]'
        )
      )
      .first();

    const passwordInput =
      this.page.locator('input[type="password"]').first();

    const loginButton = this.page.getByRole('button', {
      name: /login|sign in/i
    });

    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);

    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await loginButton.click();
  }
}