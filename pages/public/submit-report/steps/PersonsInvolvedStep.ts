import { Page } from '@playwright/test';
import { PersonInvolvedData } from '../../../../models/public/PersonInvolvedData';

export class PersonsInvolvedStep {
  constructor(private readonly page: Page) {}

  async add(person: PersonInvolvedData) {
    // TODO: confirm real add-person button and exact field labels.
    await this.page.getByRole('button', { name: /add.*person/i }).click();
    await this.page.getByLabel(/name/i).fill(person.fullName);

    if (person.position) {
      await this.page.getByLabel(/position/i).fill(person.position);
    }

    if (person.department) {
      await this.page.getByLabel(/department/i).fill(person.department);
    }

    await this.page.getByRole('button', { name: /save|add/i }).last().click();
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
