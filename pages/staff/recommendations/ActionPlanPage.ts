import { Page } from '@playwright/test';

export class ActionPlanPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async addPlan(text: string) { await this.page.getByRole('textbox').last().fill(text); }
}
