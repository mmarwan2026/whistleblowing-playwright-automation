export function textOfLength(
  length: number,
  character = 'A'
): string {
  if (length <= 0) {
    return '';
  }

  return character.repeat(length);
}

export function minValue(
  min: number
): string {
  return textOfLength(min);
}

export function belowMin(
  min: number
): string {
  return textOfLength(
    Math.max(0, min - 1)
  );
}

export function maxValue(
  max: number
): string {
  return textOfLength(max);
}

export function aboveMax(
  max: number
): string {
  return textOfLength(max + 1);
}

/**
 * Creates a syntactically valid email close to a requested length.
 *
 * This is useful for length-boundary testing without making the
 * test fail because the generated email itself is malformed.
 */
export function emailOfLength(
  targetLength: number
): string {

  const domain = '@example.com';

  if (targetLength <= domain.length) {
    throw new Error(
      `Email target length ${targetLength} is too small`
    );
  }

  return (
    'a'.repeat(targetLength - domain.length) +
    domain
  );
}

export function digitsOfLength(
  length: number
): string {
  return '1'.repeat(length);
}