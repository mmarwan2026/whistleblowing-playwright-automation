import { Locator } from '@playwright/test';

export class ConfirmationDialog {
  constructor(private readonly root: Locator) {}

  async confirm() {
    await this.root.getByRole('button', { name: /confirm|yes|submit/i }).click();
  }

  async cancel() {
    await this.root.getByRole('button', { name: /cancel|no/i }).click();
  }
}
