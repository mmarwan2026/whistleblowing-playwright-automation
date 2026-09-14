export const Roles = {
  investigator: 'investigator',
  leadInvestigator: 'lead-investigator',
  hod: 'hod',
  gciao: 'gciao',
  grc: 'grc',
  hr: 'hr',
  legal: 'legal',
  admin: 'admin'
} as const;

export type Role = typeof Roles[keyof typeof Roles];
