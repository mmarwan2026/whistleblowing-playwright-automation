import type { ReporterInfoData } from '../../models/public/ReporterData';

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

}
