import { expect, Page } from '@playwright/test';

import {
  InvolvedPerson,
  PersonInvolvedData
} from '../../../../models/public/PersonInvolvedData';

export class PersonsInvolvedStep {
  constructor(private readonly page: Page) {}

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Person(s) Involved',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByText(
        'Can You Identify the Person(s) Involved?',
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
  // CAN IDENTIFY
  // =========================================================

  async selectCanIdentify(
    answer: 'Yes' | 'No'
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
  // PERSON TABLE
  // =========================================================

  private getPersonTable() {
    return this.page.getByRole('table');
  }

  // =========================================================
  // PERSON ROW
  // =========================================================

  private async getPersonRow(
    personIndex: number
  ) {
    const table =
      this.getPersonTable();

    await expect(
      table
    ).toBeVisible();

    const rows =
      table.getByRole('row');

    /*
      Row 0 = Header
      Row 1 = Person 1
      Row 2 = Person 2
      ...
    */

    const row =
      rows.nth(personIndex + 1);

    await expect(
      row
    ).toBeVisible();

    return row;
  }

  // =========================================================
  // FILL PERSON
  // =========================================================

  async fillPerson(
    personIndex: number,
    person: InvolvedPerson
  ) {
    const row =
      await this.getPersonRow(
        personIndex
      );

    const fields =
      row.getByRole('textbox');

    /*
      Current UI order:

      0 Full Name
      1 Position
      2 Company
      3 Department
      4 Email
      5 Phone
      6 Role in the Incident
    */

    await expect(
      fields
    ).toHaveCount(7);

    // Required
    await fields
      .nth(0)
      .fill(person.fullName);

    await fields
      .nth(1)
      .fill(person.position);

    await fields
      .nth(2)
      .fill(person.company);

    // Optional
    if (person.department) {
      await fields
        .nth(3)
        .fill(person.department);
    }

    if (person.email) {
      await fields
        .nth(4)
        .fill(person.email);
    }

    if (person.phone) {
      await fields
        .nth(5)
        .fill(person.phone);
    }

    if (person.roleInIncident) {
      await fields
        .nth(6)
        .fill(
          person.roleInIncident
        );
    }

    // Verify required
    await expect(
      fields.nth(0)
    ).toHaveValue(
      person.fullName
    );

    await expect(
      fields.nth(1)
    ).toHaveValue(
      person.position
    );

    await expect(
      fields.nth(2)
    ).toHaveValue(
      person.company
    );
  }

  // =========================================================
  // ADD PERSON
  // =========================================================

  async addPerson() {
    const addButton =
      this.page.getByRole(
        'button',
        {
          name: /Person\(s\) Involved/i
        }
      );

    await expect(
      addButton
    ).toBeVisible();

    await addButton.click();
  }

  // =========================================================
  // PERSON COUNT
  // =========================================================

  async getPersonCount() {
    const table =
      this.getPersonTable();

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
  // REMOVE PERSON
  // =========================================================

  async removePerson(
    personIndex: number
  ) {
    const row =
      await this.getPersonRow(
        personIndex
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
    data: PersonInvolvedData
  ) {
    await this.selectCanIdentify(
      data.canIdentify
    );

    // No person details required
    if (
      data.canIdentify === 'No'
    ) {
      return;
    }

    if (
      !data.persons ||
      data.persons.length === 0
    ) {
      return;
    }

    for (
      let index = 0;
      index < data.persons.length;
      index++
    ) {
      // First row already exists
      if (index > 0) {
        await this.addPerson();
      }

      await this.fillPerson(
        index,
        data.persons[index]
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