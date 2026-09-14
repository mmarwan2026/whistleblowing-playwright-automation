import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/staff/LoginPage';

export class LoginFlow {
  constructor(private readonly page: Page) {}

  async login(email: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.open();
    await loginPage.login(email, password);
  }
}
