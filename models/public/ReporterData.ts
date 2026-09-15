export interface ReporterInfoData {
  identityType: 'anonymous' | 'identified';

  // Anonymous Reporter
  reporterCategory?: string;

  // Identified Reporter
  firstName?: string;
  lastName?: string;
  company?: string;
  department?: string;
  position?: string;
  mobile?: string;
  email?: string;
}