import { expect, Page } from '@playwright/test';
import { AllegationData } from '../../../../models/public/AllegationData';

export class AllegationStep {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toBeVisible();
  }

  async fillIncidentTitle(value: string) {
    await this.page
      .getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
      .fill(value);
  }

  async fillWhatHappened(value: string) {
    await this.page
      .getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
      .fill(value);
  }

  async fillRulePolicyLaw(value: string) {
    await this.page
      .getByRole('textbox', {
        name: 'What Rule, Policy, or Law May Have Been Violated?',
        exact: true
      })
      .fill(value);
  }

  async fillAwarenessMethod(value: string) {
    await this.page
      .getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
      .fill(value);
  }

  async fillIncidentLocation(value: string) {
    await this.page
      .getByRole('textbox', {
        name: 'Incident Location',
        exact: true
      })
      .fill(value);
  }

async selectExactDate(answer: 'Yes' | 'No') {
  const exactDateGroup = this.page
    .getByRole('radiogroup')
    .first();

  const radio = exactDateGroup.getByRole('radio', {
    name: answer,
    exact: true
  });

  await radio.check();
  await expect(radio).toBeChecked();

  if (answer === 'Yes') {
    await expect(
      this.page.getByRole('textbox', {
        name: 'Incident Date',
        exact: true
      })
    ).toBeVisible();
  }
}

  async fillIncidentDate(value: string) {
    const incidentDate = this.page.getByRole('textbox', {
      name: 'Incident Date',
      exact: true
    });

    await expect(incidentDate).toBeVisible();
    await incidentDate.fill(value);
  }

  async selectOngoing(
    answer: 'Yes' | 'No' | "I don't know"
  ) {
    const group = this.page.getByRole('radiogroup', {
      name: 'Is Incident Ongoing?'
    });

    await group
      .getByRole('radio', {
        name: answer,
        exact: true
      })
      .check();
  }

  async fill(data: AllegationData) {
    await this.fillIncidentTitle(data.incidentTitle);
    await this.fillWhatHappened(data.whatHappened);
    await this.fillAwarenessMethod(data.awarenessMethod);

    if (data.rulePolicyLaw) {
      await this.fillRulePolicyLaw(data.rulePolicyLaw);
    }

    if (data.incidentLocation) {
      await this.fillIncidentLocation(data.incidentLocation);
    }

    if (data.knowsExactDate) {
      await this.selectExactDate(data.knowsExactDate);

      if (
        data.knowsExactDate === 'Yes' &&
        data.incidentDate
      ) {
        await this.fillIncidentDate(data.incidentDate);
      }
    }

    if (data.ongoing) {
      await this.selectOngoing(data.ongoing);
    }
  }

  async next() {
    await this.page
      .getByRole('button', { name: 'Next' })
      .click();
  }

  async back() {
    await this.page
      .getByRole('button', { name: 'Back' })
      .click();
  }
}