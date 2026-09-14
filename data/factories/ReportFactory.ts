import { ReportData } from '../../models/public/ReportData';
import { ReporterFactory } from './ReporterFactory';
import { ClassificationFactory } from './ClassificationFactory';
import { AllegationFactory } from './AllegationFactory';

export class ReportFactory {
  static anonymous(): ReportData {
    return {
      reporter: ReporterFactory.anonymousEmployee(),
      classification: ClassificationFactory.default(),
      allegation: AllegationFactory.default(),
      personsInvolved: [],
      witnesses: [],
      evidence: { filePaths: [] },
      previousReporting: { reportedBefore: false },
      declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
      }
    };
  }
}
