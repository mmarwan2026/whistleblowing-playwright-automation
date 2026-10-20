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

    await expect(this.page.getByRole('checkbox', {
      name: "I don't have any documents to upload"
    })).toBeVisible();
  }

  // =========================================================
  // SELECT YES / NO
  // =========================================================

  async selectEvidenceAnswer(
    answer: EvidenceData['hasSupportingEvidence']
  ): Promise<void> {

    const checkbox = this.page.getByRole('checkbox', {
      name: "I don't have any documents to upload"
    });
    if (answer === 'No' && !(await checkbox.isChecked())) await checkbox.click();
    if (answer === 'Yes' && await checkbox.isChecked()) await checkbox.click();
    if (answer === 'No') await expect(checkbox).toBeChecked();
    if (answer === 'Yes') await expect(checkbox).not.toBeChecked();
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

    return this.page
      .getByRole('row')
      .filter({
        hasText: fileName
      });
  }

  // =========================================================
  // VERIFY UPLOAD SECTION
  // =========================================================

  async verifyUploadSectionVisible(): Promise<void> {

    await expect(this.page.getByRole('button', { name: 'Upload File', exact: true })).toBeVisible();
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

    await this.page.getByRole('button', {
      name: 'Upload File',
      exact: true
    }).last().click();

    const consentButton = this.page.getByRole('dialog').getByRole('button', {
      name: 'I Accept',
      exact: true
    });

    await expect(consentButton).toBeVisible();
    await consentButton.click();
    await expect(this.page.getByRole('dialog')).toBeHidden();
    await fileInput.setInputFiles(filePath);

  }

  // =========================================================
  // UPLOAD MULTIPLE FILES
  // =========================================================

  async uploadFiles(
    filePaths: string[]
  ): Promise<void> {
    for (const filePath of filePaths) {
      await this.uploadFile(filePath);
    }
  }

  // =========================================================
  // VERIFY FILE UPLOADED
  // =========================================================

  async verifyFileUploaded(
    fileName: string
  ): Promise<void> {

    const fileItem =
      this.getFileItem(
        fileName
      );

    await expect(
      fileItem
    ).toBeVisible();

    await expect(
      fileItem.getByText(
        fileName,
        {
          exact: true
        }
      )
    ).toBeVisible();
  }

  async fillFileDescriptions(
    descriptions: string[]
  ): Promise<void> {
    const fields = this.page.locator(
      'textarea[placeholder*="Please clearly indicate how this document relates"]'
    );

    await expect(fields).toHaveCount(descriptions.length);

    for (let index = 0; index < descriptions.length; index += 1) {
      await fields.nth(index).fill(descriptions[index]);
    }
  }

  // =========================================================
  // VERIFY FILE NOT PRESENT
  // =========================================================

  async verifyFileNotPresent(
    fileName: string
  ): Promise<void> {

    await expect(
      this.page.getByText(
        fileName,
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
        { name: new RegExp(`Remove.*${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') }
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

      if (data.fileDescriptions?.length) {
        await this.fillFileDescriptions(data.fileDescriptions);
      }

      return;
    }

    // -------------------------------------------------------
    // MULTIPLE FILES
    // -------------------------------------------------------

    await this.uploadFiles(
      data.filePaths
    );

    if (data.fileDescriptions?.length) {
      await this.fillFileDescriptions(data.fileDescriptions);
    }
  }

  // =========================================================
  // NEXT
  // =========================================================

  async next(): Promise<void> {
    const next = this.page.getByRole('button', { name: 'Next', exact: true });
    const destination = this.page.getByRole('heading', { name: 'Declaration', level: 2 });
    await next.click();
    try {
      await expect(destination).toBeVisible({ timeout: 3000 });
    } catch {
      await expect(this.page.getByRole('heading', { name: 'Evidence', level: 2 })).toBeVisible();
      await next.click();
      await expect(destination).toBeVisible();
    }
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
