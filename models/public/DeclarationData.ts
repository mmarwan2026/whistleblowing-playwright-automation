/**
 * Declaration state for report submission.
 *
 * The live public UI exposes one acknowledgement checkbox. The two legacy
 * boolean fields are retained because existing fixtures and flow code use
 * them to represent the declaration statements.
 */
export interface DeclarationData {
  /** Current UI-level acknowledgement state. */
  acknowledged?: boolean;

  /** Legacy statement acknowledgement retained for existing fixtures. */
  accurateInformation?: boolean;

  /** Legacy confidentiality acknowledgement retained for existing fixtures. */
  confidentialityAcknowledged?: boolean;
}

/** Returns true when either the current or legacy declaration is accepted. */
export function isDeclarationAccepted(data: DeclarationData): boolean {
  if (data.acknowledged !== undefined) return data.acknowledged;

  return data.accurateInformation === true && data.confidentialityAcknowledged === true;
}
