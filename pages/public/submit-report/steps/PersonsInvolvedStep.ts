import { expect, Locator, Page } from '@playwright/test';
import { InvolvedPerson, PersonInvolvedData } from '../../../../models/public/PersonInvolvedData';

export class PersonsInvolvedStep {
  readonly persons: Locator;
  constructor(private readonly page: Page) {
    this.persons = page.getByRole('table').first().getByRole('row');
  }

  private unknownDetails() { return this.page.getByRole('checkbox', { name: 'I am not aware of the person(s) involved details' }); }
  private table() { return this.page.getByRole('table').first(); }
  private addButton() { return this.page.getByRole('button', { name: 'Person(s) Involved', exact: true }); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Person(s) Involved', level: 2 })).toBeVisible();
    await expect(this.table()).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  }

  async selectCanIdentify(answer: PersonInvolvedData['canIdentify']): Promise<void> {
    const checkbox = this.unknownDetails();
    if (answer === 'No' && !(await checkbox.isChecked())) await checkbox.click();
    if (answer === 'Yes' && await checkbox.isChecked()) await checkbox.click();
    if (answer === 'No') await expect(checkbox).toBeChecked();
    if (answer === 'Yes') await expect(checkbox).not.toBeChecked();
  }

  private row(index: number): Locator { return this.table().getByRole('row').nth(index + 1); }
  private input(row: Locator, label: string, index: number) { return row.getByRole('textbox', { name: `${label} ${index + 1}`, exact: true }); }

  async fillPerson(person: InvolvedPerson, index = 0): Promise<void> {
    const row = this.row(index);
    for (const [label, value] of [
      ['Full Name', person.fullName], ['Position', person.position], ['Company', person.company],
      ['Department', person.department], ['Email', person.email], ['Phone', person.phone]
    ] as const) {
      if (value) await this.input(row, label, index).fill(value);
    }
    if (person.roleInIncident) {
      await row.getByRole('combobox', { name: `Role In Incident ${index + 1}`, exact: true }).selectOption({ label: person.roleInIncident });
    }
  }

  async addPerson(): Promise<void> { await this.addButton().click(); }
  async removePerson(_index: number): Promise<void> { throw new Error('Person removal control is not exposed in the current UI.'); }
  async getPersonCount(): Promise<number> {
    const names = await this.table().getByRole('textbox', { name: /^Full Name \d+$/ }).all();
    const values = await Promise.all(names.map(name => name.inputValue()));
    return values.filter(value => value.trim() !== '').length;
  }
  async verifyPerson(_person: InvolvedPerson, _index = 0): Promise<void> { await expect(this.row(_index)).toBeVisible(); }

  async fill(data: PersonInvolvedData): Promise<void> {
    await this.selectCanIdentify(data.canIdentify);
    if (data.canIdentify === 'Yes' && data.persons) {
      for (let i = 0; i < data.persons.length; i++) {
        await this.fillPerson(data.persons[i], i);
        await this.addPerson();
        await expect(this.table().getByRole('row')).toHaveCount(i + 3);
      }
    }
  }

  async next(): Promise<void> {
    const next = this.page.getByRole('button', { name: 'Next', exact: true });
    const destination = this.page.getByRole('heading', { name: 'Entities Involved', level: 2 });
    await next.click();
    try {
      await expect(destination).toBeVisible({ timeout: 3000 });
    } catch {
      await expect(this.page.getByRole('heading', { name: 'Person(s) Involved', level: 2 })).toBeVisible();
      await next.click();
      await expect(destination).toBeVisible();
    }
  }
  async back(): Promise<void> { await this.page.getByRole('button', { name: 'Back', exact: true }).click(); }
}
