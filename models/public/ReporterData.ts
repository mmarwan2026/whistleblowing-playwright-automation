export type ReporterIdentityType = 'anonymous' | 'identified';

/** Reporter data captured on Reporter Information. */
export interface ReporterInfoData {

  identityType: ReporterIdentityType;

  // Anonymous Reporter

  reporterCategory?: string;

  // Identified Reporter

  firstName?: string;

  lastName?: string;

  company?: string;

  department?: string;

  position?: string;

  mobile?: string;

  mobileCountryCode?: string;

  email?: string;
}
