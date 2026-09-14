import { Page } from '@playwright/test';
import { AllegationData } from '../../../../models/public/AllegationData';

export class AllegationStep {
  constructor(private readonly page: Page) {}

  async fill(data: AllegationData) {
    await this.page.getByLabel(/What Happened/i).fill(data.whatHappened);
    await this.page.getByLabel(/What Rule.*Policy.*Law/i).fill(data.ruleViolation);
    await this.page.getByLabel(/How Did You Become Aware/i).fill(data.awareness);
    await this.page.getByLabel(/Incident Date$/i).fill(data.incidentDate);

    if (data.incidentDateDescription) {
      const description = this.page.getByLabel(/Incident Date Description/i);
      if (await description.isVisible().catch(() => false)) {
        await description.fill(data.incidentDateDescription);
      }
    }

    await this.page.getByLabel(/Number of Individuals Involved/i)
      .fill(String(data.numberOfIndividuals));

    await this.page.getByLabel(/Incident Location/i).fill(data.incidentLocation);

    const ongoingName = /Is the Issue Still Ongoing/i;
    const choice = data.ongoing ? /yes/i : /no/i;
    await this.page.getByRole('radio', { name: choice }).click().catch(async () => {
      const group = this.page.getByText(ongoingName);
      await group.getByText(choice).click();
    });
  }

  async next() {
    await this.page.getByRole('button', { name: 'Next' }).click();
  }
}
