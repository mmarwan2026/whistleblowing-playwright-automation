import { ReportData } from '../../models/public/ReportData';

import { ReporterFactory } from './ReporterFactory';
import { ClassificationFactory } from './ClassificationFactory';
import { AllegationFactory } from './AllegationFactory';

export class ReportFactory {

  static anonymous(): ReportData {

    return {
      reporter:
        ReporterFactory.anonymousEmployee(),

      classification:
        ClassificationFactory.default(),

      allegation:
        AllegationFactory.default(),

      personsInvolved: {
        canIdentify: 'No'
      },

      witnesses: {
        hasWitnesses: 'No'
      },

      evidence: {
        hasSupportingEvidence: 'No'
      },

      previousReporting: {
        previouslyReported: 'No'
      },

      declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
      }
    };
  }
}