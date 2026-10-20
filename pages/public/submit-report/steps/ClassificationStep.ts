import { expect, Page } from '@playwright/test';
import { ClassificationData } from '../../../../models/public/ClassificationData';

/** Compatibility API for the current consolidated "Report Details" step. */
export class ClassificationStep {
  constructor(private readonly page: Page) {}

  private category() { return this.page.locator('select[name="subcategory"]'); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
    await expect(this.category()).toBeVisible();
    await expect(this.page.locator('#incidentdescrip')).toBeVisible();
    await expect(this.page.locator('#howdidyoubecome')).toBeVisible();
  }

  async selectInternalAuditAnswer(_answer: 'Yes' | 'No'): Promise<void> {}

  async selectCategory(category: string): Promise<void> {
    const field = this.category();
    await expect(field).toBeEnabled();
    const option = field.locator('option').filter({ hasText: category }).first();
    await expect(option).toHaveCount(1);
    await field.selectOption({ label: (await option.textContent())?.trim() || category });
  }

  async fillOther(_value: string): Promise<void> {}

  async fill(data: ClassificationData): Promise<void> {
    await this.selectCategory(data.category);
  }

  // Report Details is filled by AllegationStep for backwards-compatible callers.
  async next(): Promise<void> {}

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }
}
