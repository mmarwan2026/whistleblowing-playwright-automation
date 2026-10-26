import {
  ReporterInfoData
} from './ReporterData';

import {
  PersonInvolvedData
} from './PersonInvolvedData';

import {
  EntitiesInvolvedData
} from './EntitiesInvolvedData';

import {
  EvidenceData
} from './EvidenceData';

import {
  PreviousReportingData
} from './PreviousReportingData';

import {
  DeclarationData
} from './DeclarationData';

import {
  ReportDetailsData
} from './ReportDetailsData';


export interface ReportData {

  reporter:
  ReporterInfoData;

  /** Canonical data shape for the current public Report Details UI. */
  reportDetails:
  ReportDetailsData;

  personsInvolved:
  PersonInvolvedData;

  // Current UI step 4 - Entities Involved
  entitiesInvolved:
  EntitiesInvolvedData;

  evidence:
  EvidenceData;

  previousReporting:
  PreviousReportingData;

  declaration:
  DeclarationData;
}
