import {
  ReporterInfoData
} from '../../models/public/ReporterData';

export class ReporterFactory {

  // ==========================================================
  // ANONYMOUS EMPLOYEE
  // ==========================================================

  static anonymousEmployee(): ReporterInfoData {

    return {
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    };
  }

  // ==========================================================
  // IDENTIFIED EMPLOYEE
  // ==========================================================

  static identifiedEmployee(): ReporterInfoData {

    return {
      identityType: 'identified',
      reporterCategory: 'Employee'
    };
  }
}