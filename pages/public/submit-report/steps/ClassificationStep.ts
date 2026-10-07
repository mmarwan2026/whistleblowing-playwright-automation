import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import {
  ClassificationData
} from '../../../../models/public/ClassificationData';

import {
  Dropdown
} from '../../../../components/common/Dropdown';


export class ClassificationStep {

  constructor(
    private readonly page: Page
  ) { }


  // ==========================================================
  // LOCATORS
  // ==========================================================

  private categoryDropdown(): Locator {

    /*
     * Current application DOM:
     *
     * Visible field = Category
     *
     * But application currently renders:
     *
     * <select
     *   id="subcategory"
     *   name="subcategory"
     * >
     *   <option>Select Category</option>
     *   ...
     * </select>
     *
     * Do NOT use the incorrect DOM id/name as the business
     * meaning of this field.
     *
     * Locate the select using its Category placeholder option.
     */

    return this.page
      .locator('select')
      .filter({
        has: this.page.locator(
          'option',
          {
            hasText: 'Select Category'
          }
        )
      });
  }


  private otherField(): Locator {

    return this.page.getByLabel(
      'Other',
      {
        exact: true
      }
    );
  }


  // ==========================================================
  // VERIFY LOADED
  // ==========================================================

  async verifyLoaded():
    Promise<void> {

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: 'Classification',
          level: 2
        }
      )
    ).toBeVisible();


    // --------------------------------------------------------
    // Internal Audit - Yes
    // --------------------------------------------------------

    await expect(
      this.page.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeVisible();


    // --------------------------------------------------------
    // Internal Audit - No
    // --------------------------------------------------------

    await expect(
      this.page.getByRole(
        'radio',
        {
          name: 'No',
          exact: true
        }
      )
    ).toBeVisible();


    // --------------------------------------------------------
    // Category
    // --------------------------------------------------------

    await expect(
      this.categoryDropdown()
    ).toBeVisible();

    await expect(
      this.categoryDropdown()
    ).toBeEnabled();
  }


  // ==========================================================
  // INTERNAL AUDIT
  // ==========================================================

  async selectInternalAuditAnswer(
    answer: 'Yes' | 'No'
  ): Promise<void> {

    const radio =
      this.page.getByRole(
        'radio',
        {
          name: answer,
          exact: true
        }
      );

    await expect(
      radio
    ).toBeVisible();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();
  }


  // ==========================================================
  // CATEGORY
  // ==========================================================

  async selectCategory(
    category: string
  ): Promise<void> {

    const dropdown =
      this.categoryDropdown();

    await expect(
      dropdown
    ).toBeVisible();

    await expect(
      dropdown
    ).toBeEnabled();

    await new Dropdown(
      this.page,
      dropdown
    ).select(
      category
    );


    // Verify selected Category.
    await expect(
      dropdown
    ).toHaveValue(
      category
    );
  }


  // ==========================================================
  // OTHER
  // ==========================================================

  async fillOther(
    value: string
  ): Promise<void> {

    const other =
      this.otherField();

    await expect(
      other
    ).toBeVisible();

    await expect(
      other
    ).toBeEnabled();

    await other.fill(
      value
    );

    await expect(
      other
    ).toHaveValue(
      value
    );
  }


  // ==========================================================
  // FILL CLASSIFICATION
  // ==========================================================

  async fill(
    data: ClassificationData
  ): Promise<void> {

    // --------------------------------------------------------
    // Internal Audit Question
    // --------------------------------------------------------

    if (
      data.internalAuditAnswer
    ) {

      await this.selectInternalAuditAnswer(
        data.internalAuditAnswer
      );
    }


    // --------------------------------------------------------
    // Category
    // --------------------------------------------------------

    await this.selectCategory(
      data.category
    );


    // --------------------------------------------------------
    // Other - Conditional
    // --------------------------------------------------------

    if (
      data.otherText
    ) {

      await this.fillOther(
        data.otherText
      );
    }
  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  async next():
    Promise<void> {

    const nextButton =
      this.page.getByRole(
        'button',
        {
          name: 'Next',
          exact: true
        }
      );

    await expect(
      nextButton
    ).toBeVisible();

    await expect(
      nextButton
    ).toBeEnabled();

    await nextButton.click();
  }


  async back():
    Promise<void> {

    const backButton =
      this.page.getByRole(
        'button',
        {
          name: 'Back',
          exact: true
        }
      );

    await expect(
      backButton
    ).toBeVisible();

    await expect(
      backButton
    ).toBeEnabled();

    await backButton.click();
  }
}