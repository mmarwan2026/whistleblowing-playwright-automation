import { expect, Page } from '@playwright/test';
import { WitnessData } from '../../../../models/public/WitnessData';

/** Compatibility façade: the current wizard no longer has a Witnesses step. */
export class WitnessesStep {
  constructor(private readonly page: Page) {}
  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
  }
  async fill(_data: WitnessData): Promise<void> {}
  async selectWitnessAnswer(_answer: 'Yes' | 'No'): Promise<void> {}
  async next(): Promise<void> {}
  async back(): Promise<void> { await this.page.getByRole('button', { name: 'Back', exact: true }).click(); }
  async getWitnessCount(): Promise<number> { return 0; }
  async verifyWitness(_index: number, _data?: unknown): Promise<void> {}
  async removeWitness(_index: number): Promise<void> {}
}
