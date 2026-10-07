import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import {
  EvidenceData
} from '../../../../models/public/EvidenceData';

export class EvidenceStep {

  constructor(
    private readonly page: Page
  ) { }

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded(): Promise<void> {

    await expect(
      this.page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /Do You Have Any Supporting Evidence\s*\?/i
      )
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
  }

  // =========================================================
  // SELECT YES / NO
  // =========================================================

  async selectEvidenceAnswer(
    answer: EvidenceData['hasSupportingEvidence']
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

  // =========================================================
  // FILE INPUT
  // =========================================================

  private getFileInput(): Locator {

    return this.page.locator(
      'input[type="file"]'
    );
  }

  // =========================================================
  // DISPLAYED FILE NAME
  // =========================================================

  private normalizeDisplayedFileName(
    fileName: string
  ): string {

    /*
      Current UI removes "-" characters
      from the displayed filename.

      Example:
      test-file.pdf
      ->
      testfile.pdf
    */

    return fileName.replace(
      /-/g,
      ''
    );
  }

  // =========================================================
  // FILE ITEM
  // =========================================================

  private getFileItem(
    fileName: string
  ): Locator {

    const displayedFileName =
      this.normalizeDisplayedFileName(
        fileName
      );

    return this.page
      .getByRole('listitem')
      .filter({
        hasText: displayedFileName
      });
  }

  // =========================================================
  // VERIFY UPLOAD SECTION
  // =========================================================

  async verifyUploadSectionVisible(): Promise<void> {

    await expect(
      this.page.getByText(
        'File Upload Guidance:',
        {
          exact: false
        }
      )
    ).toBeVisible();

    await expect(
      this.getFileInput()
    ).toHaveCount(1);
  }

  // =========================================================
  // UPLOAD SINGLE FILE
  // =========================================================

  async uploadFile(
    filePath: string
  ): Promise<void> {

    const fileInput =
      this.getFileInput();

    await expect(
      fileInput
    ).toHaveCount(1);

    await fileInput.setInputFiles(
      filePath
    );
  }

  // =========================================================
  // UPLOAD MULTIPLE FILES
  // =========================================================

  async uploadFiles(
    filePaths: string[]
  ): Promise<void> {

    const fileInput =
      this.getFileInput();

    await expect(
      fileInput
    ).toHaveCount(1);

    await fileInput.setInputFiles(
      filePaths
    );
  }

  // =========================================================
  // VERIFY FILE UPLOADED
  // =========================================================

  async verifyFileUploaded(
    fileName: string
  ): Promise<void> {

    const displayedFileName =
      this.normalizeDisplayedFileName(
        fileName
      );

    const fileItem =
      this.getFileItem(
        fileName
      );

    await expect(
      fileItem
    ).toBeVisible();

    await expect(
      fileItem.getByText(
        displayedFileName,
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      fileItem.getByText(
        /Uploaded/i
      )
    ).toBeVisible();

    await expect(
      fileItem.getByRole(
        'button',
        {
          name:
            `Remove: ${displayedFileName}`,
          exact: true
        }
      )
    ).toBeVisible();
  }

  // =========================================================
  // VERIFY FILE NOT PRESENT
  // =========================================================

  async verifyFileNotPresent(
    fileName: string
  ): Promise<void> {

    const displayedFileName =
      this.normalizeDisplayedFileName(
        fileName
      );

    await expect(
      this.page.getByText(
        displayedFileName,
        {
          exact: true
        }
      )
    ).toBeHidden();
  }

  // =========================================================
  // REMOVE FILE
  // =========================================================

  async removeFile(
    fileName: string
  ): Promise<void> {

    const displayedFileName =
      this.normalizeDisplayedFileName(
        fileName
      );

    const fileItem =
      this.getFileItem(
        fileName
      );

    await expect(
      fileItem
    ).toBeVisible();

    const removeButton =
      fileItem.getByRole(
        'button',
        {
          name:
            `Remove: ${displayedFileName}`,
          exact: true
        }
      );

    await expect(
      removeButton
    ).toBeVisible();

    await removeButton.click();

    await expect(
      fileItem
    ).toBeHidden();
  }

  // =========================================================
  // FILL COMPLETE STEP
  // =========================================================

  async fill(
    data: EvidenceData
  ): Promise<void> {

    await this.selectEvidenceAnswer(
      data.hasSupportingEvidence
    );

    // -------------------------------------------------------
    // NO -> no upload required
    // -------------------------------------------------------

    if (
      data.hasSupportingEvidence === 'No'
    ) {
      return;
    }

    // -------------------------------------------------------
    // YES -> upload section should appear
    // -------------------------------------------------------

    await this.verifyUploadSectionVisible();

    /*
      Do not throw if Yes is selected
      without files.

      Negative tests may intentionally
      verify this application's validation.
    */

    if (
      !data.filePaths ||
      data.filePaths.length === 0
    ) {
      return;
    }

    // -------------------------------------------------------
    // SINGLE FILE
    // -------------------------------------------------------

    if (
      data.filePaths.length === 1
    ) {
      await this.uploadFile(
        data.filePaths[0]
      );

      return;
    }

    // -------------------------------------------------------
    // MULTIPLE FILES
    // -------------------------------------------------------

    await this.uploadFiles(
      data.filePaths
    );
  }

  // =========================================================
  // NEXT
  // =========================================================

  async next(): Promise<void> {

    await this.page
      .getByRole(
        'button',
        {
          name: 'Next',
          exact: true
        }
      )
      .click();
  }

  // =========================================================
  // BACK
  // =========================================================

  async back(): Promise<void> {

    await this.page
      .getByRole(
        'button',
        {
          name: 'Back',
          exact: true
        }
      )
      .click();
  }
} 