import { Locator } from '@playwright/test';

export class Checkbox {
  constructor(private readonly root: Locator) {}
}
