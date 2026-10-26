import type { ReportData } from '../../models/public/ReportData';

import {
  ReporterFactory
} from './ReporterFactory';

import { ReportDetailsFactory } from './ReportDetailsFactory';

export class ReportFactory {

  // ==========================================================
  // ANONYMOUS - MINIMUM VALID REPORT
  //
  // Used by lifecycle / orchestration tests where the purpose
  // is not to test every optional intake field.
  // ==========================================================

  static anonymous(): ReportData {
    const reportDetails = ReportDetailsFactory.default();

    return {

      // ------------------------------------------------------
      // REPORTER
      // ------------------------------------------------------

      reporter:
        ReporterFactory.anonymousEmployee(),

      reportDetails,

      // ------------------------------------------------------
      // PERSON(S) INVOLVED
      // ------------------------------------------------------

      personsInvolved: {
        canIdentify: 'No'
      },
      entitiesInvolved: {
        canIdentify: 'No',
      },

      // ------------------------------------------------------
      // EVIDENCE
      // ------------------------------------------------------

      evidence: {
        hasSupportingEvidence: 'No'
      },

      // ------------------------------------------------------
      // PREVIOUS REPORTING
      // ------------------------------------------------------

      previousReporting: {
        previouslyReported: 'No'
      },

      // ------------------------------------------------------
      // DECLARATION
      // ------------------------------------------------------

      declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
      }
    };
  }
}
