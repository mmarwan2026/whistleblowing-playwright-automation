import { expect, Page } from '@playwright/test';

import {
  Witness,
  WitnessData
} from '../../../../models/public/WitnessData';

export class WitnessesStep {
  constructor(private readonly page: Page) {}

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Witnesses',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByText(
        'Were There Any Witnesses?',
        {
          exact: true
        }
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

    await expect(
      this.page.getByRole('radio', {
        name: "I don't know",
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Back',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Next',
        exact: true
      })
    ).toBeVisible();
  }

  // =========================================================
  // WITNESS ANSWER
  // =========================================================

  async selectWitnessAnswer(
    answer: WitnessData['hasWitnesses']
  ) {
    const radio = this.page.getByRole(
      'radio',
      {
        name: answer,
        exact: true
      }
    );

    await expect(radio).toBeVisible();

    await radio.check();

    await expect(radio).toBeChecked();
  }

  // =========================================================
  // WITNESSES TABLE
  // =========================================================

  private getWitnessTable() {
    return this.page.getByRole('table');
  }

  // =========================================================
  // WITNESS ROW
  // =========================================================

  private async getWitnessRow(
    witnessIndex: number
  ) {
    const table =
      this.getWitnessTable();

    await expect(
      table
    ).toBeVisible();

    const rows =
      table.getByRole('row');

    /*
      Row 0 = Header
      Row 1 = Witness 1
      Row 2 = Witness 2
      ...
    */

    const row =
      rows.nth(witnessIndex + 1);

    await expect(
      row
    ).toBeVisible();

    return row;
  }

  // =========================================================
  // FILL WITNESS
  // =========================================================

  async fillWitness(
    witnessIndex: number,
    witness: Witness
  ) {
    const row =
      await this.getWitnessRow(
        witnessIndex
      );

    const fields =
      row.getByRole('textbox');

    /*
      UI order confirmed visually:

      0 First Name
      1 Last Name
      2 Position
      3 Department
      4 Notes
    */

    await expect(
      fields
    ).toHaveCount(5);

    if (witness.firstName) {
      await fields
        .nth(0)
        .fill(witness.firstName);
    }

    if (witness.lastName) {
      await fields
        .nth(1)
        .fill(witness.lastName);
    }

    if (witness.position) {
      await fields
        .nth(2)
        .fill(witness.position);
    }

    if (witness.department) {
      await fields
        .nth(3)
        .fill(witness.department);
    }

    if (witness.notes) {
      await fields
        .nth(4)
        .fill(witness.notes);
    }
  }

  // =========================================================
  // ADD WITNESS
  // =========================================================

  async addWitness() {
    const addButton =
      this.page.getByRole(
        'button',
        {
          name: /Witnesses/i
        }
      );

    await expect(
      addButton
    ).toBeVisible();

    await addButton.click();
  }

  // =========================================================
  // WITNESS COUNT
  // =========================================================

  async getWitnessCount() {
    const table =
      this.getWitnessTable();

    await expect(
      table
    ).toBeVisible();

    const rows =
      table.getByRole('row');

    const count =
      await rows.count();

    return Math.max(
      count - 1,
      0
    );
  }

  // =========================================================
  // REMOVE WITNESS
  // =========================================================

  async removeWitness(
    witnessIndex: number
  ) {
    const row =
      await this.getWitnessRow(
        witnessIndex
      );

    const buttons =
      row.getByRole('button');

    await expect(
      buttons
    ).toHaveCount(1);

    await buttons.click();
  }

  // =========================================================
  // FILL COMPLETE STEP
  // =========================================================

  async fill(
    data: WitnessData
  ) {
    await this.selectWitnessAnswer(
      data.hasWitnesses
    );

    if (
      data.hasWitnesses !== 'Yes'
    ) {
      return;
    }

    if (
      !data.witnesses ||
      data.witnesses.length === 0
    ) {
      return;
    }

    for (
      let index = 0;
      index < data.witnesses.length;
      index++
    ) {
      /*
        First row already appears when Yes is selected.
        Additional rows require + Witnesses.
      */

      if (index > 0) {
        await this.addWitness();
      }

      await this.fillWitness(
        index,
        data.witnesses[index]
      );
    }
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