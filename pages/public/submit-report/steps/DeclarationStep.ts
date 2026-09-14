import { Page } from '@playwright/test';
import { DeclarationData } from '../../../../models/public/DeclarationData';

export class DeclarationStep {
  constructor(private readonly page: Page) {}

  async fill(data: DeclarationData) {
    const boxes = this.page.getByRole('checkbox');

    if (data.accurateInformation) {
      await boxes.nth(0).check();
    }

    if (data.confidentialityAcknowledged) {
      await boxes.nth(1).check();
    }
  }

  async submit() {
    await this.page.getByRole('button', { name: /submit/i }).click();
  }
}
