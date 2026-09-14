import { test as base } from '@playwright/test';
import { SubmitReportPage } from '../pages/public/submit-report/SubmitReportPage';
import { FollowUpFlow } from '../flows/public/FollowUpFlow';
import { AnonymousReportFlow } from '../flows/public/AnonymousReportFlow';
import { DashboardPage } from '../pages/staff/DashboardPage';

type Fixtures = {
  submitReportPage: SubmitReportPage;
  anonymousReportFlow: AnonymousReportFlow;
  followUpFlow: FollowUpFlow;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  submitReportPage: async ({ page }, use) => {
    await use(new SubmitReportPage(page));
  },

  anonymousReportFlow: async ({ page }, use) => {
    await use(new AnonymousReportFlow(page));
  },

  followUpFlow: async ({ page }, use) => {
    await use(new FollowUpFlow(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  }
});

export { expect } from '@playwright/test';
