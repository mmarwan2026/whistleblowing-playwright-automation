import { Locator } from '@playwright/test';

export class Button {
  constructor(private readonly root: Locator) {}
}
