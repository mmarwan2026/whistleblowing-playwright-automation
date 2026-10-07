import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import {
  WitnessData,
  Witness
} from '../../../../models/public/WitnessData';


export class WitnessesStep {

  constructor(
    private readonly page: Page
  ) { }


  // ============================================================
  // PAGE LOCATORS
  // ============================================================

  private heading(): Locator {
    return this.page.getByRole('heading', {
      name: /^Witnesses$/i
    });
  }


  private yesRadio(): Locator {
    return this.page.getByRole(
      'radio',
      {
        name: 'Yes',
        exact: true
      }
    );
  }


  private noRadio(): Locator {
    return this.page.getByRole(
      'radio',
      {
        name: 'No',
        exact: true
      }
    );
  }


  private table(): Locator {
    return this.page.getByRole(
      'table'
    );
  }


  private addWitnessButton(): Locator {
    return this.page.getByRole(
      'button',
      {
        name: 'Witnesses',
        exact: true
      }
    );
  }


  private backButton(): Locator {
    return this.page.getByRole(
      'button',
      {
        name: 'Back',
        exact: true
      }
    );
  }


  private nextButton(): Locator {
    return this.page.getByRole(
      'button',
      {
        name: 'Next',
        exact: true
      }
    );
  }


  // ============================================================
  // WITNESS FIELD LOCATORS
  //
  // Confirmed current DOM:
  //
  // First Name 1
  // Last Name 1
  // Position 1
  // Department 1
  // Company 1
  // Notes 1
  // ============================================================

  private firstNameInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `First Name ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private lastNameInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `Last Name ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private positionInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `Position ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private departmentInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `Department ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private companyInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `Company ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private notesInput(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'textbox',
      {
        name:
          `Notes ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  private removeWitnessButton(
    witnessIndex: number
  ): Locator {

    return this.page.getByRole(
      'button',
      {
        name:
          `Remove row ${witnessIndex + 1}`,
        exact: true
      }
    );
  }


  // ============================================================
  // VERIFY LOADED
  // ============================================================

  async verifyLoaded(): Promise<void> {

    await expect(
      this.heading()
    ).toBeVisible();

    await expect(
      this.yesRadio()
    ).toBeVisible();

    await expect(
      this.noRadio()
    ).toBeVisible();

    await expect(
      this.backButton()
    ).toBeVisible();

    await expect(
      this.nextButton()
    ).toBeVisible();
  }


  // ============================================================
  // SELECT YES / NO
  // ============================================================

  async selectWitnessAnswer(
    answer: WitnessData['hasWitnesses']
  ): Promise<void> {

    const radio =
      answer === 'Yes'
        ? this.yesRadio()
        : this.noRadio();


    await expect(
      radio
    ).toBeVisible();

    await expect(
      radio
    ).toBeEnabled();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();


    if (
      answer === 'Yes'
    ) {

      await expect(
        this.table()
      ).toBeVisible();

      await expect(
        this.firstNameInput(0)
      ).toBeVisible();

      await expect(
        this.lastNameInput(0)
      ).toBeVisible();

      await expect(
        this.positionInput(0)
      ).toBeVisible();

      await expect(
        this.departmentInput(0)
      ).toBeVisible();

      await expect(
        this.companyInput(0)
      ).toBeVisible();

      await expect(
        this.notesInput(0)
      ).toBeVisible();
    }
  }


  // ============================================================
  // GET WITNESS COUNT
  // ============================================================

  async getWitnessCount(): Promise<number> {

    const table =
      this.table();


    if (
      !(await table.isVisible())
    ) {
      return 0;
    }


    const rowCount =
      await table
        .getByRole('row')
        .count();


    return Math.max(
      rowCount - 1,
      0
    );
  }


  // ============================================================
  // FILL WITNESS
  // ============================================================

  async fillWitness(
    witnessIndex: number,
    witness: Witness
  ): Promise<void> {

    const witnessCount =
      await this.getWitnessCount();


    if (
      witnessIndex < 0 ||
      witnessIndex >= witnessCount
    ) {
      throw new Error(
        `Witness row ${witnessIndex + 1} is not available. ` +
        `Current witness count: ${witnessCount}.`
      );
    }


    // FIRST NAME
    if (
      witness.firstName !== undefined
    ) {

      const input =
        this.firstNameInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.firstName
      );

      await expect(input)
        .toHaveValue(
          witness.firstName
        );
    }


    // LAST NAME
    if (
      witness.lastName !== undefined
    ) {

      const input =
        this.lastNameInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.lastName
      );

      await expect(input)
        .toHaveValue(
          witness.lastName
        );
    }


    // POSITION
    if (
      witness.position !== undefined
    ) {

      const input =
        this.positionInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.position
      );

      await expect(input)
        .toHaveValue(
          witness.position
        );
    }


    // DEPARTMENT
    if (
      witness.department !== undefined
    ) {

      const input =
        this.departmentInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.department
      );

      await expect(input)
        .toHaveValue(
          witness.department
        );
    }


    // COMPANY
    if (
      witness.company !== undefined
    ) {

      const input =
        this.companyInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.company
      );

      await expect(input)
        .toHaveValue(
          witness.company
        );
    }


    // NOTES
    if (
      witness.notes !== undefined
    ) {

      const input =
        this.notesInput(
          witnessIndex
        );

      await expect(input)
        .toBeVisible();

      await input.fill(
        witness.notes
      );

      await expect(input)
        .toHaveValue(
          witness.notes
        );
    }
  }


  // ============================================================
  // VERIFY WITNESS DATA
  // ============================================================

  async verifyWitness(
    witnessIndex: number,
    witness: Witness
  ): Promise<void> {

    if (
      witness.firstName !== undefined
    ) {

      await expect(
        this.firstNameInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.firstName
      );
    }


    if (
      witness.lastName !== undefined
    ) {

      await expect(
        this.lastNameInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.lastName
      );
    }


    if (
      witness.position !== undefined
    ) {

      await expect(
        this.positionInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.position
      );
    }


    if (
      witness.department !== undefined
    ) {

      await expect(
        this.departmentInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.department
      );
    }


    if (
      witness.company !== undefined
    ) {

      await expect(
        this.companyInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.company
      );
    }


    if (
      witness.notes !== undefined
    ) {

      await expect(
        this.notesInput(
          witnessIndex
        )
      ).toHaveValue(
        witness.notes
      );
    }
  }


  // ============================================================
  // ADD WITNESS
  // ============================================================

  async addWitness(): Promise<void> {

    const countBefore =
      await this.getWitnessCount();


    const button =
      this.addWitnessButton();


    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();


    await expect.poll(
      async () =>
        this.getWitnessCount(),
      {
        message:
          'Expected a new Witness row to be added.'
      }
    ).toBe(
      countBefore + 1
    );


    await expect(
      this.firstNameInput(
        countBefore
      )
    ).toBeVisible();
  }


  // ============================================================
  // REMOVE WITNESS
  // ============================================================

  async removeWitness(
    witnessIndex: number
  ): Promise<void> {

    const countBefore =
      await this.getWitnessCount();


    if (
      countBefore <= 1
    ) {
      throw new Error(
        'Cannot remove Witness because only one witness row exists.'
      );
    }


    if (
      witnessIndex < 0 ||
      witnessIndex >= countBefore
    ) {
      throw new Error(
        `Invalid witness index ${witnessIndex}. ` +
        `Current witness count: ${countBefore}.`
      );
    }


    const button =
      this.removeWitnessButton(
        witnessIndex
      );


    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();


    await expect.poll(
      async () =>
        this.getWitnessCount(),
      {
        message:
          `Expected Witness row ${witnessIndex + 1} to be removed.`
      }
    ).toBe(
      countBefore - 1
    );
  }


  // ============================================================
  // FILL COMPLETE WITNESSES STEP
  // ============================================================

  async fill(
    data: WitnessData
  ): Promise<void> {

    await this.verifyLoaded();


    await this.selectWitnessAnswer(
      data.hasWitnesses
    );


    if (
      data.hasWitnesses === 'No'
    ) {
      return;
    }


    const witnesses =
      data.witnesses ?? [];


    if (
      witnesses.length === 0
    ) {
      return;
    }


    for (
      let index = 0;
      index < witnesses.length;
      index++
    ) {

      // Initial row already exists.
      if (
        index > 0
      ) {
        await this.addWitness();
      }


      await this.fillWitness(
        index,
        witnesses[index]
      );
    }
  }


  // ============================================================
  // NEXT
  // ============================================================

  async next(): Promise<void> {

    const button =
      this.nextButton();


    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();
  }


  // ============================================================
  // BACK
  // ============================================================

  async back(): Promise<void> {

    const button =
      this.backButton();


    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();
  }
}