import { expect, Page } from '@playwright/test';
import { ClassificationData } from '../../../../models/public/ClassificationData';
import { Dropdown } from '../../../../components/common/Dropdown';

export class ClassificationStep {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Classification',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('radio', {
        name: 'No',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('combobox', {
        name: 'Category',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('combobox', {
        name: 'Subcategory',
        exact: true
      })
    ).toBeVisible();
  }

  async selectInternalAuditAnswer(answer: 'Yes' | 'No') {
    await this.page
      .getByRole('radio', {
        name: answer,
        exact: true
      })
      .check();
  }

  async selectCategory(category: string) {
    const categoryDropdown = this.page.getByRole('combobox', {
      name: 'Category',
      exact: true
    });

    await new Dropdown(
      this.page,
      categoryDropdown
    ).select(category);
  }

  async selectSubcategory(subCategory: string) {
    const subcategoryDropdown = this.page.getByRole('combobox', {
      name: 'Subcategory',
      exact: true
    });

    await new Dropdown(
      this.page,
      subcategoryDropdown
    ).select(subCategory);
  }

  async fill(data: ClassificationData) {
    if (data.internalAuditAnswer) {
      await this.selectInternalAuditAnswer(
        data.internalAuditAnswer
      );
    }

    await this.selectCategory(data.category);

    if (data.subCategory) {
      await this.selectSubcategory(
        data.subCategory
      );
    }

    if (data.otherText) {
      const other = this.page.getByLabel(
        'Other',
        { exact: true }
      );

      if (await other.isVisible().catch(() => false)) {
        await other.fill(data.otherText);
      }
    }
  }

  async next() {
    await this.page
      .getByRole('button', {
        name: 'Next'
      })
      .click();
  }

  async back() {
    await this.page
      .getByRole('button', {
        name: 'Back'
      })
      .click();
  }
}