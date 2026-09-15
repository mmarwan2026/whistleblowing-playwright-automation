import { expect, Page } from '@playwright/test';

import {
  EvidenceData
} from '../../../../models/public/EvidenceData';

export class EvidenceStep {
  constructor(private readonly page: Page) {}

  // =========================================================
  // VERIFY PAGE
  // =========================================================

 async verifyLoaded() {
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
  ) {
    const radio =
      this.page.getByRole('radio', {
        name: answer,
        exact: true
      });

    await expect(radio).toBeVisible();

    await radio.check();

    await expect(radio).toBeChecked();
  }

  // =========================================================
  // FILE INPUT
  // =========================================================

  private getFileInput() {
    return this.page.locator(
      'input[type="file"]'
    );
  }

  // =========================================================
  // VERIFY UPLOAD SECTION
  // =========================================================

  async verifyUploadSectionVisible() {
  await expect(
    this.page.getByText(
      'File Upload Guidance:',
      { exact: false }
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
  ) {
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
  ) {
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
  // VERIFY FILE
  // =========================================================
private normalizeDisplayedFileName(fileName: string): string {
  return fileName.replace(/-/g, '');
}

async verifyFileUploaded(fileName: string) {
  const displayedFileName =
    this.normalizeDisplayedFileName(fileName);

  const fileItem = this.page
    .getByRole('listitem')
    .filter({
      hasText: displayedFileName
    });

  await expect(fileItem).toBeVisible();

  await expect(
    fileItem.getByText(displayedFileName, {
      exact: true
    })
  ).toBeVisible();

  await expect(
    fileItem.getByText(/Uploaded/i)
  ).toBeVisible();

  await expect(
    fileItem.getByRole('button', {
      name: `Remove: ${displayedFileName}`,
      exact: true
    })
  ).toBeVisible();
}
  // =========================================================
  // VERIFY FILE NOT PRESENT
  // =========================================================

  async verifyFileNotPresent(
    fileName: string
  ) {
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
    fileName?: string
  ) {
    if (fileName) {
      const fileItem =
        this.page
          .getByText(
            fileName,
            {
              exact: true
            }
          )
          .locator('..');

      const remove =
        fileItem.getByText(
          'Remove',
          {
            exact: true
          }
        );

      if (
        await remove.isVisible()
          .catch(() => false)
      ) {
        await remove.click();

        return;
      }
    }

    const removeButton =
      this.page.getByText(
        'Remove',
        {
          exact: true
        }
      ).first();

    await expect(
      removeButton
    ).toBeVisible();

    await removeButton.click();
  }

  // =========================================================
  // FILL COMPLETE STEP
  // =========================================================

  async fill(
    data: EvidenceData
  ) {
    await this.selectEvidenceAnswer(
      data.hasSupportingEvidence
    );

    if (
      data.hasSupportingEvidence === 'No'
    ) {
      return;
    }

    await this.verifyUploadSectionVisible();

    if (
      !data.filePaths ||
      data.filePaths.length === 0
    ) {
      return;
    }

    if (
      data.filePaths.length === 1
    ) {
      await this.uploadFile(
        data.filePaths[0]
      );

      return;
    }

    await this.uploadFiles(
      data.filePaths
    );
  }

  // =========================================================
  // NEXT
  // =========================================================

  async next() {
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

  // =========================================================
  // BACK
  // =========================================================

  async back() {
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