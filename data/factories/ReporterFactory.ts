import { ReporterInfoData } from '../../models/public/ReporterData';

export class ReporterFactory {
  static anonymousEmployee(): ReporterInfoData {
    return {
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    };
  }

  static identifiedEmployee(): ReporterInfoData {
    return {
      identityType: 'identified',
      reporterCategory: 'Employee'
    };
  }
}
