import { ReporterInfoData } from './ReporterData';
import { ClassificationData } from './ClassificationData';
import { AllegationData } from './AllegationData';
import { PersonInvolvedData } from './PersonInvolvedData';
import { WitnessData } from './WitnessData';
import { EvidenceData } from './EvidenceData';
import { PreviousReportingData } from './PreviousReportingData';
import { DeclarationData } from './DeclarationData';

export interface ReportData {
  reporter: ReporterInfoData;
  classification: ClassificationData;
  allegation: AllegationData;
  personsInvolved: PersonInvolvedData[];
  witnesses: WitnessData[];
  evidence: EvidenceData;
  previousReporting: PreviousReportingData;
  declaration: DeclarationData;
}
