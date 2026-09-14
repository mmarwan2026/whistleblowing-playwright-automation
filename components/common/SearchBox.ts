import { Locator } from '@playwright/test';

export class SearchBox {
  constructor(private readonly input: Locator) {}

  async search(text: string) {
    await this.input.fill(text);
  }

  async clear() {
    await this.input.clear();
  }
}
