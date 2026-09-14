import { Locator } from '@playwright/test';

export class MessageThread {
  constructor(private readonly root: Locator) {}
}
