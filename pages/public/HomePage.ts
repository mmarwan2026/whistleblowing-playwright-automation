import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { Routes } from '../../config/urls';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto(Routes.public.home);
  }

  async startReport() {
    await this.page.getByRole('link', { name: /submit.*report|report/i }).click();
  }
}
