import {
  ReportData
} from '../../models/public/ReportData';

import {
  ReporterFactory
} from './ReporterFactory';

import {
  ClassificationFactory
} from './ClassificationFactory';

import {
  AllegationFactory
} from './AllegationFactory';

export class ReportFactory {

  // ==========================================================
  // ANONYMOUS - MINIMUM VALID REPORT
  //
  // Used by lifecycle / orchestration tests where the purpose
  // is not to test every optional intake field.
  // ==========================================================

  static anonymous(): ReportData {

    return {

      // ------------------------------------------------------
      // REPORTER
      // ------------------------------------------------------

      reporter:
        ReporterFactory.anonymousEmployee(),

      // ------------------------------------------------------
      // CLASSIFICATION
      // ------------------------------------------------------

      classification:
        ClassificationFactory.default(),

      // ------------------------------------------------------
      // ALLEGATION
      // ------------------------------------------------------

      allegation:
        AllegationFactory.default(),

      reportDetails: {
        category: 'Conflict of Interest-Nepotism/Cronyism',
        incidentDescription: 'Synthetic factory report for automation validation.',
        awarenessMethod: 'Synthetic automation validation.',
        incidentDate: '2026-01-01',
        ongoing: 'No'
      },

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
      // WITNESSES
      // ------------------------------------------------------

      witnesses: {
        hasWitnesses: 'No'
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
