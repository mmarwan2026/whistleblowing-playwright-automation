import {
  test as base,
  expect,
} from '@playwright/test';

import { DashboardPage } from '../pages/staff/DashboardPage';

type TestFixtures = {
  dashboardPage: DashboardPage;
};

export const test =
  base.extend<TestFixtures>({
    dashboardPage: async (
      { page },
      use,
    ) => {
      const dashboardPage =
        new DashboardPage(page);

      await use(dashboardPage);
    },
  });

export { expect };