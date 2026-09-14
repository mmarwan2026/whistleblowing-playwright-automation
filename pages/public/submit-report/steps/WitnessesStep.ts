import { Page } from '@playwright/test';
import { WitnessData } from '../../../../models/public/WitnessData';

export class WitnessesStep {
  constructor(private readonly page: Page) {}

  async add(witness: WitnessData) {
    // TODO: confirm exact witness controls.
    await this.page.getByRole('button', { name: /add.*witness/i }).click();
    await this.page.getByLabel(/name/i).fill(witness.fullName);

    if (witness.contactInfo) {
      await this.page.getByLabel(/contact/i).fill(witness.contactInfo);
    }

    await this.page.getByRole('button', { name: /save|add/i }).last().click();
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
