import { Page } from '@playwright/test';
import { EvidenceData } from '../../../../models/public/EvidenceData';
import { FileUploader } from '../../../../components/common/FileUploader';

export class EvidenceStep {
  constructor(private readonly page: Page) {}

  async fill(data: EvidenceData) {
    if (data.filePaths.length) {
      const uploader = new FileUploader(this.page.locator('input[type="file"]'));
      await uploader.upload(data.filePaths);
    }

    if (data.description) {
      const description = this.page.getByLabel(/description/i);
      if (await description.isVisible().catch(() => false)) {
        await description.fill(data.description);
      }
    }
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
