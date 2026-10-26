export type SupportingEvidenceAnswer = 'Yes' | 'No';

/** Evidence selection and uploaded-file metadata for the public Evidence step. */
export interface EvidenceData {
  hasSupportingEvidence: SupportingEvidenceAnswer;
  filePaths?: string[];
  fileDescriptions?: string[];
}
