import { Locator } from '@playwright/test';

export class FilePreview {
  constructor(private readonly root: Locator) {}
}
