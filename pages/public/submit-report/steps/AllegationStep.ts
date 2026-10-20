import { expect, Page } from '@playwright/test';
import { AllegationData } from '../../../../models/public/AllegationData';

/** Compatibility API for fields consolidated into the current Report Details step. */
export class AllegationStep {
  constructor(private readonly page: Page) {}
  private field(id: string) { return this.page.locator(`#${id}`); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
    await expect(this.field('incidentdescrip')).toBeVisible();
    await expect(this.field('howdidyoubecome')).toBeVisible();
  }

  async fillIncidentTitle(_value: string): Promise<void> {}

  async fillWhatHappened(value: string): Promise<void> {
    await this.field('incidentdescrip').fill(value);
    await expect(this.field('incidentdescrip')).toHaveValue(value);
  }

  async fillRulePolicyLaw(value: string): Promise<void> {
    await this.field('whatrulepolicyo').fill(value);
    await expect(this.field('whatrulepolicyo')).toHaveValue(value);
  }

  async fillAwarenessMethod(value: string): Promise<void> {
    await this.field('howdidyoubecome').fill(value);
    await expect(this.field('howdidyoubecome')).toHaveValue(value);
  }

  async fillIncidentLocation(value: string): Promise<void> {
    await this.field('incidentlocatio').fill(value);
    await expect(this.field('incidentlocatio')).toHaveValue(value);
  }

  async selectExactDate(_answer: 'Yes' | 'No'): Promise<void> {
    await expect(this.field('incidentdate')).toBeVisible();
  }

  async fillIncidentDate(value: string): Promise<void> {
    await this.field('incidentdate').fill(value);
    await expect(this.field('incidentdate')).toHaveValue(value);
  }

  async fillIncidentDateDescription(_value: string): Promise<void> {}

  async selectOngoing(answer: 'Yes' | 'No' | 'Unknown'): Promise<void> {
    await this.page.getByRole('radio', { name: answer, exact: true }).check();
  }

  async fill(data: AllegationData): Promise<void> {
    if (data.whatHappened) await this.fillWhatHappened(data.whatHappened);
    if (data.rulePolicyLaw) await this.fillRulePolicyLaw(data.rulePolicyLaw);
    if (data.awarenessMethod) await this.fillAwarenessMethod(data.awarenessMethod);
    if (data.incidentLocation) await this.fillIncidentLocation(data.incidentLocation);
    if (data.incidentDate) {
      await this.fillIncidentDate(data.incidentDate);
    } else if (data.incidentDateDescription) {
      // The current UI represents exact and approximate dates with one required
      // date control. Preserve legacy month/year fixtures at the first day.
      const match = data.incidentDateDescription.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
      const month = match ? new Date(`${match[1]} 1, ${match[2]}`).getMonth() + 1 : 1;
      const year = match ? Number(match[2]) : new Date().getFullYear();
      await this.fillIncidentDate(`${year}-${String(month).padStart(2, '0')}-01`);
    }
    if (data.ongoing) await this.selectOngoing(data.ongoing);
  }

  async next(): Promise<void> {
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }
}
