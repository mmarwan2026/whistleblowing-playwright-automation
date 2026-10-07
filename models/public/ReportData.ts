import {
  ReporterInfoData
} from './ReporterData';

import {
  ClassificationData
} from './ClassificationData';

import {
  AllegationData
} from './AllegationData';

import {
  PersonInvolvedData
} from './PersonInvolvedData';

import {
  EntitiesInvolvedData
} from './EntitiesInvolvedData';

import {
  WitnessData
} from './WitnessData';

import {
  EvidenceData
} from './EvidenceData';

import {
  PreviousReportingData
} from './PreviousReportingData';

import {
  DeclarationData
} from './DeclarationData';


export interface ReportData {

  reporter:
  ReporterInfoData;

  classification:
  ClassificationData;

  allegation:
  AllegationData;

  personsInvolved:
  PersonInvolvedData;

  // Step 5 - Entities Involved
  entitiesInvolved:
  EntitiesInvolvedData;

  witnesses:
  WitnessData;

  evidence:
  EvidenceData;

  previousReporting:
  PreviousReportingData;

  declaration:
  DeclarationData;
}