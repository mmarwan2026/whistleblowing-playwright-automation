import { Locator } from '@playwright/test';

export class DatePicker {
  constructor(private readonly input: Locator) {}

  async setDate(value: string) {
    await this.input.fill(value);
  }
}
