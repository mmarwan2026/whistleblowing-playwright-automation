import { StaffDashboardPage } from './dashboard/StaffDashboardPage';

/**
 * Backward-compatible alias.
 *
 * Existing fixtures/tests can continue importing DashboardPage
 * while the implementation lives in StaffDashboardPage.
 */
export class DashboardPage extends StaffDashboardPage { }