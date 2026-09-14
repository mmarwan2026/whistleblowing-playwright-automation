import { Locator } from '@playwright/test';

export class MessageComposer {
  constructor(private readonly root: Locator) {}
}
