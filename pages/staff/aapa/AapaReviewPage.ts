import { Page } from '@playwright/test';

export class AapaReviewPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async addAssessment(notes: string) { await this.page.getByRole('textbox').last().fill(notes); }
}
