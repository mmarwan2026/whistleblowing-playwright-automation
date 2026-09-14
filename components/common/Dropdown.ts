import { Locator, Page } from '@playwright/test';

export class Dropdown {
  constructor(
    private readonly page: Page,
    private readonly trigger: Locator,
    private readonly optionContainer?: Locator
  ) {}

  async select(optionText: string) {
    const tagName = await this.trigger.evaluate(
      element => element.tagName.toLowerCase()
    );

    if (tagName === 'select') {
      await this.trigger.selectOption({ label: optionText });
      return;
    }

    await this.trigger.click();

    const scope = this.optionContainer ?? this.page;
    await scope
      .getByRole('option', { name: optionText, exact: true })
      .click();
  }
}
