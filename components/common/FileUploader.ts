import { Locator } from '@playwright/test';

export class FileUploader {
  constructor(private readonly input: Locator) {}

  async upload(filePath: string | string[]) {
    await this.input.setInputFiles(filePath);
  }

  async clear() {
    await this.input.setInputFiles([]);
  }
}
