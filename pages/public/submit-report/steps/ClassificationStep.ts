import { Page } from '@playwright/test';
import { ClassificationData } from '../../../../models/public/ClassificationData';
import { Dropdown } from '../../../../components/common/Dropdown';

export class ClassificationStep {
  constructor(private readonly page: Page) {}

  async fill(data: ClassificationData) {
    // TODO: confirm exact labels and whether these are native/custom dropdowns.
    await new Dropdown(this.page, this.page.getByLabel(/category/i)).select(data.category);

    if (data.subCategory) {
      await new Dropdown(this.page, this.page.getByLabel(/sub.?category/i)).select(data.subCategory);
    }

    if (data.otherText) {
      const other = this.page.getByLabel(/other/i);
      if (await other.isVisible().catch(() => false)) {
        await other.fill(data.otherText);
      }
    }
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
