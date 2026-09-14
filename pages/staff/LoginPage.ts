import { Page } from '@playwright/test';
import { getEnvironment } from '../../config/environments';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto(`${getEnvironment().staffUrl}/login`);
  }

  async login(email: string, password: string) {
    await this.page.getByLabel(/email|username/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /login|sign in/i }).click();
  }
}
