import { expect, Page } from '@playwright/test';
import { PreviousReportingData } from '../../../../models/public/PreviousReportingData';

const NO_REPORT = 'No, this is the first time I am reporting the matter(s)';
const PLATFORM_REPORT = 'Yes, through the whistleblowing platform';
const OTHER_CHANNEL_REPORT = 'Yes, through another reporting channel (e.g., management, HR, Compliance, or Internal Audit)';

export type PreviousReportingOption = 'platform' | 'anotherChannel' | 'none';

export class PreviousReportingStep {
  constructor(private readonly page: Page) {}
  private noRadio() { return this.page.getByRole('radio', { name: NO_REPORT }); }
  private platformRadio() { return this.page.getByRole('radio', { name: PLATFORM_REPORT }); }
  private otherChannelRadio() { return this.page.getByRole('radio', { name: OTHER_CHANNEL_REPORT }); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Have these matter(s) previously been reported, escalated, or investigated?', level: 3 })).toBeVisible();
    await expect(this.platformRadio()).toBeVisible();
    await expect(this.otherChannelRadio()).toBeVisible();
    await expect(this.noRadio()).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  }

  async selectReportingOption(option: PreviousReportingOption): Promise<void> {
    const radio = option === 'platform'
      ? this.platformRadio()
      : option === 'anotherChannel'
        ? this.otherChannelRadio()
        : this.noRadio();

    await radio.check();
    await expect(radio).toBeChecked();
  }

  async selectPreviouslyReported(answer: 'Yes' | 'No'): Promise<void> {
    await this.selectReportingOption(answer === 'Yes' ? 'platform' : 'none');
  }
  async verifySystemReferenceQuestionVisible(): Promise<void> { await expect(this.page.getByText(/Reference Number/i).first()).toBeVisible(); }
  async selectSystemReferenceAnswer(answer: 'Yes' | 'No' | "I don't remember"): Promise<void> {
    await this.page.getByRole('radio', { name: new RegExp(answer === "I don't remember" ? 'No' : answer, 'i') }).last().check();
  }
  async verifyReferenceNumberVisible(): Promise<void> { await expect(this.page.getByLabel(/reference number/i).first()).toBeVisible(); }
  private async optionalFill(pattern: RegExp, value: string): Promise<void> {
    const field = this.page.getByRole('textbox', { name: pattern }).first();
    if (await field.count()) {
      await field.fill(value);
      return;
    }
    if (pattern.test('reporting date')) {
      const date = this.page.locator('input[name="dateofreporting"], input[id="dateofreporting"]').first();
      if (await date.count()) await date.fill(value);
    }
  }
  async fillReferenceNumber(value: string): Promise<void> { await this.optionalFill(/reference number/i, value); }
  async selectReportingChannelType(value: string): Promise<void> {
    await this.page.getByRole('combobox', { name: /through which channel was the matter/i }).selectOption({ label: value });
  }
  async fillReportedToDepartment(value: string): Promise<void> {
    await this.page.getByRole('textbox', { name: /which department, function, or team received the report/i }).fill(value);
  }
  async fillRelevantInfo(value: string): Promise<void> { await this.optionalFill(/relevant/i, value); }
  async fillOutcome(value: string): Promise<void> { await this.optionalFill(/outcome/i, value); }
  async fillFirstName(value: string): Promise<void> { await this.optionalFill(/full name|first name/i, value); }
  async fillLastName(value: string): Promise<void> { await this.optionalFill(/last name/i, value); }
  async fillPositionDepartment(value: string): Promise<void> { await this.page.getByRole('textbox', { name: 'Position', exact: true }).fill(value); }
  async fillPreviousReporterCompany(value: string): Promise<void> { await this.optionalFill(/^company$/i, value); }
  async fillPreviousReporterDepartment(value: string): Promise<void> { await this.page.getByRole('textbox', { name: 'Department', exact: true }).fill(value); }
  async verifyToWhomVisible(): Promise<void> { await expect(this.page.getByText(/To whom/i).first()).toBeVisible(); }
  async selectExactDate(answer: 'Yes' | 'No'): Promise<void> { await this.page.getByRole('radio', { name: new RegExp(answer, 'i') }).last().check(); }
  async verifyReportingDateVisible(): Promise<void> { await expect(this.page.getByLabel(/reporting date/i)).toBeVisible(); }
  async fillReportingDate(value: string): Promise<void> { await this.optionalFill(/reporting date/i, value); }
  async verifyDateDescriptionVisible(): Promise<void> { await expect(this.page.getByLabel(/date description/i)).toBeVisible(); }
  async fillDateDescription(value: string): Promise<void> { await this.optionalFill(/date description/i, value); }

  async fill(data: PreviousReportingData): Promise<void> {
    await this.selectReportingOption(
      data.previouslyReported === 'No'
        ? 'none'
        : data.reportingChannel ?? 'platform'
    );
    if (data.hasSystemReference) await this.selectSystemReferenceAnswer(data.hasSystemReference);
    if (data.reportingChannelType) await this.selectReportingChannelType(data.reportingChannelType);
    if (data.reportedToDepartment) await this.fillReportedToDepartment(data.reportedToDepartment);
    if (data.referenceNumber) await this.fillReferenceNumber(data.referenceNumber);
    if (data.relevantInfo) await this.fillRelevantInfo(data.relevantInfo);
    if (data.outcomeIfKnown) await this.fillOutcome(data.outcomeIfKnown);
    if (data.firstName) await this.fillFirstName(data.firstName);
    if (data.lastName) await this.fillLastName(data.lastName);
    if (data.positionDepartment) await this.fillPositionDepartment(data.positionDepartment);
    if (data.previousReporterCompany) await this.fillPreviousReporterCompany(data.previousReporterCompany);
    if (data.previousReporterDepartment) await this.fillPreviousReporterDepartment(data.previousReporterDepartment);
    if (data.reportingDate) {
      await this.fillReportingDate(data.reportingDate);
    } else if (data.dateDescription) {
      const match = data.dateDescription.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
      if (match) {
        const month = new Date(`${match[1]} 1, ${match[2]}`).getMonth() + 1;
        await this.fillReportingDate(`${match[2]}-${String(month).padStart(2, '0')}-01`);
      }
    }
    if (data.dateDescription) await this.fillDateDescription(data.dateDescription);
  }
  async next(): Promise<void> { await this.page.getByRole('button', { name: 'Next', exact: true }).click(); }
  async back(): Promise<void> { await this.page.getByRole('button', { name: 'Back', exact: true }).click(); }
}
