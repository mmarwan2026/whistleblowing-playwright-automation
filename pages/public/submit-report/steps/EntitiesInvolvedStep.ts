import { expect, Locator, Page } from '@playwright/test';
import { EntityInvolved, EntitiesInvolvedData } from '../../../../models/public/EntitiesInvolvedData';

export class EntitiesInvolvedStep {
  readonly entities: Locator;
  constructor(private readonly page: Page) {
    this.entities = page.getByRole('table').first().getByRole('row');
  }

  private table() { return this.page.getByRole('table').first(); }
  private unknownDetails() { return this.page.getByRole('checkbox', { name: "I'm not aware of the entity(s) involved details" }); }
  private addButton() { return this.page.getByRole('button', { name: 'Entities Involved', exact: true }); }
  private row(index: number) { return this.table().getByRole('row').nth(index + 1); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Entities Involved', level: 2 })).toBeVisible();
    await expect(this.table()).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  }

  async selectCanIdentify(answer: EntitiesInvolvedData['canIdentify']): Promise<void> {
    const checkbox = this.unknownDetails();
    if (answer === 'No' && !(await checkbox.isChecked())) await checkbox.check();
    if (answer === 'Yes' && await checkbox.isChecked()) await checkbox.uncheck();
    if (answer === 'No') await expect(checkbox).toBeChecked();
    if (answer === 'Yes') await expect(checkbox).not.toBeChecked();
  }

  async addEntity(): Promise<void> { await this.addButton().click(); }
  async enterEntityName(index: number, name: string): Promise<void> {
    await this.row(index).getByRole('textbox', { name: `Entity Name ${index + 1}`, exact: true }).fill(name);
  }
  async removeEntity(_index: number): Promise<void> { throw new Error('Entity removal control is not exposed in the current UI.'); }
  async getEntityCount(): Promise<number> { return Math.max(0, (await this.table().getByRole('row').count()) - 1); }
  async verifyEntityName(indexOrName: number | string, nameOrIndex: string | number = 0): Promise<void> {
    const index = typeof indexOrName === 'number' ? indexOrName : Number(nameOrIndex);
    const name = typeof indexOrName === 'string' ? indexOrName : String(nameOrIndex);
    await expect(this.row(index)).toContainText(name);
  }

  async fill(data: EntitiesInvolvedData): Promise<void> {
    await this.selectCanIdentify(data.canIdentify);
    if (data.canIdentify === 'Yes' && data.entities) {
      for (let i = 0; i < data.entities.length; i++) {
        if (i > 0) await this.addEntity();
        await this.row(i).getByRole('textbox', { name: `Entity Name ${i + 1}`, exact: true }).fill(data.entities[i].entityName);
      }
    }
  }

  async next(): Promise<void> {
    const next = this.page.getByRole('button', { name: 'Next', exact: true });
    const destination = this.page.getByRole('heading', { name: 'Previous Reporting', level: 2 });
    await next.click();
    try {
      await expect(destination).toBeVisible({ timeout: 3000 });
    } catch {
      await expect(this.page.getByRole('heading', { name: 'Entities Involved', level: 2 })).toBeVisible();
      await next.click();
      await expect(destination).toBeVisible();
    }
  }
  async back(): Promise<void> { await this.page.getByRole('button', { name: 'Back', exact: true }).click(); }
}
