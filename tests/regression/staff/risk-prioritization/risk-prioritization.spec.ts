import { test, expect } from '@playwright/test';

/**
 * Weighted Allegation Risk and Prioritization Matrix
 *
 * Scope:
 * - Business-rule automation for weighted score calculation
 * - Priority band boundaries
 * - Automatic Critical overrides
 * - Automatic High overrides
 * - Override precedence
 *
 * NOTE:
 * This suite validates the specified decision rules independently.
 * It does NOT yet validate the real Risk Matrix UI.
 * UI automation should be added after the actual controls/locators are discovered.
 */

type Rating = 1 | 3 | 5 | 10;
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

interface RiskRatings {
  natureSeverity: Rating;
  regulatoryExposure: Rating;
  subjectSeniority: Rating;
  operationalImpact: Rating;
  reputationImpact: Rating;
  financialExposure: Rating;
  evidenceRisk: Rating;
  retaliationSafetyRisk: Rating;
  controlBreakdown: Rating;
  credibility: Rating;
  recurrenceSuppression: Rating;
  investigationComplexity: Rating;
}

interface OverrideTriggers {
  // Automatic Critical
  cLevelCeoOrBoard?: boolean;
  activeRegulatorOrLawEnforcement?: boolean;
  majorPublicMediaImpact?: boolean;
  immediateEvidenceDestructionRisk?: boolean;
  sexualHarassment?: boolean;

  // Automatic High
  directorToSeniorExecutiveDirector?: boolean;
  retaliation?: boolean;
  actualConflictOfInterest?: boolean;
  crossFunctionalDepartmental?: boolean;
}

const WEIGHTS: Record<keyof RiskRatings, number> = {
  natureSeverity: 15,
  regulatoryExposure: 12,
  subjectSeniority: 12,
  operationalImpact: 10,
  reputationImpact: 10,
  financialExposure: 8,
  evidenceRisk: 8,
  retaliationSafetyRisk: 7,
  controlBreakdown: 8,
  credibility: 4,
  recurrenceSuppression: 3,
  investigationComplexity: 3,
};

const PRIORITY_RANK: Record<Priority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

function createRatings(rating: Rating): RiskRatings {
  return {
    natureSeverity: rating,
    regulatoryExposure: rating,
    subjectSeniority: rating,
    operationalImpact: rating,
    reputationImpact: rating,
    financialExposure: rating,
    evidenceRisk: rating,
    retaliationSafetyRisk: rating,
    controlBreakdown: rating,
    credibility: rating,
    recurrenceSuppression: rating,
    investigationComplexity: rating,
  };
}

function calculateWeightedScore(ratings: RiskRatings): number {
  const total = (Object.keys(WEIGHTS) as Array<keyof RiskRatings>)
    .reduce((sum, criterion) => {
      return sum + (ratings[criterion] * WEIGHTS[criterion]);
    }, 0);

  return Number((total / 100).toFixed(2));
}

function getCalculatedPriority(score: number): Priority {
  if (score < 1 || score > 10) {
    throw new Error(`Risk score must be between 1.00 and 10.00. Received: ${score}`);
  }

  if (score >= 7.00) return 'Critical';
  if (score >= 4.50) return 'High';
  if (score >= 2.50) return 'Medium';

  return 'Low';
}

function hasCriticalTrigger(triggers: OverrideTriggers): boolean {
  return Boolean(
    triggers.cLevelCeoOrBoard ||
    triggers.activeRegulatorOrLawEnforcement ||
    triggers.majorPublicMediaImpact ||
    triggers.immediateEvidenceDestructionRisk ||
    triggers.sexualHarassment
  );
}

function hasHighTrigger(triggers: OverrideTriggers): boolean {
  return Boolean(
    triggers.directorToSeniorExecutiveDirector ||
    triggers.retaliation ||
    triggers.actualConflictOfInterest ||
    triggers.crossFunctionalDepartmental
  );
}

function getFinalPriority(
  calculatedPriority: Priority,
  triggers: OverrideTriggers = {}
): Priority {
  // Critical Trigger -> Critical
  if (hasCriticalTrigger(triggers)) {
    return 'Critical';
  }

  // High Trigger -> At least High
  if (hasHighTrigger(triggers)) {
    return PRIORITY_RANK[calculatedPriority] < PRIORITY_RANK.High
      ? 'High'
      : calculatedPriority;
  }

  // No Trigger -> calculated priority
  return calculatedPriority;
}

function assessRisk(
  ratings: RiskRatings,
  triggers: OverrideTriggers = {}
) {
  const score = calculateWeightedScore(ratings);
  const calculatedPriority = getCalculatedPriority(score);
  const finalPriority = getFinalPriority(calculatedPriority, triggers);

  return {
    score,
    calculatedPriority,
    finalPriority,
  };
}

test.describe('Weighted Allegation Risk and Prioritization Matrix', () => {

  test('RISK-001 | All Low ratings produce 1.00 and Low priority', () => {
    const result = assessRisk(createRatings(1));

    expect(result.score).toBe(1.00);
    expect(result.calculatedPriority).toBe('Low');
    expect(result.finalPriority).toBe('Low');
  });

  test('RISK-002 | All Medium ratings produce 3.00 and Medium priority', () => {
    const result = assessRisk(createRatings(3));

    expect(result.score).toBe(3.00);
    expect(result.calculatedPriority).toBe('Medium');
    expect(result.finalPriority).toBe('Medium');
  });

  test('RISK-003 | All High ratings produce 5.00 and High priority', () => {
    const result = assessRisk(createRatings(5));

    expect(result.score).toBe(5.00);
    expect(result.calculatedPriority).toBe('High');
    expect(result.finalPriority).toBe('High');
  });

  test('RISK-004 | All Critical ratings produce 10.00 and Critical priority', () => {
    const result = assessRisk(createRatings(10));

    expect(result.score).toBe(10.00);
    expect(result.calculatedPriority).toBe('Critical');
    expect(result.finalPriority).toBe('Critical');
  });

  test('RISK-005 | Mixed ratings use weighted calculation correctly', () => {
    const ratings: RiskRatings = {
      natureSeverity: 10,
      regulatoryExposure: 5,
      subjectSeniority: 3,
      operationalImpact: 1,
      reputationImpact: 5,
      financialExposure: 3,
      evidenceRisk: 10,
      retaliationSafetyRisk: 1,
      controlBreakdown: 3,
      credibility: 5,
      recurrenceSuppression: 1,
      investigationComplexity: 3,
    };

    // Expected:
    // (15*10 + 12*5 + 12*3 + 10*1 + 10*5 + 8*3 +
    //  8*10 + 7*1 + 8*3 + 4*5 + 3*1 + 3*3) / 100
    // = 4.73
    const result = assessRisk(ratings);

    expect(result.score).toBe(4.73);
    expect(result.calculatedPriority).toBe('High');
    expect(result.finalPriority).toBe('High');
  });

  test('RISK-006 | Nature and severity uses 15% weight', () => {
    const ratings = createRatings(1);
    ratings.natureSeverity = 10;

    expect(calculateWeightedScore(ratings)).toBe(2.35);
  });

  test('RISK-007 | Regulatory exposure uses 12% weight', () => {
    const ratings = createRatings(1);
    ratings.regulatoryExposure = 10;

    expect(calculateWeightedScore(ratings)).toBe(2.08);
  });

  test('RISK-008 | Subject seniority uses 12% weight', () => {
    const ratings = createRatings(1);
    ratings.subjectSeniority = 10;

    expect(calculateWeightedScore(ratings)).toBe(2.08);
  });

  test('RISK-009 | Operational impact uses 10% weight', () => {
    const ratings = createRatings(1);
    ratings.operationalImpact = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.90);
  });

  test('RISK-010 | Reputation uses 10% weight', () => {
    const ratings = createRatings(1);
    ratings.reputationImpact = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.90);
  });

  test('RISK-011 | Financial exposure uses 8% weight', () => {
    const ratings = createRatings(1);
    ratings.financialExposure = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.72);
  });

  test('RISK-012 | Evidence preservation risk uses 8% weight', () => {
    const ratings = createRatings(1);
    ratings.evidenceRisk = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.72);
  });

  test('RISK-013 | Retaliation/safety uses 7% weight', () => {
    const ratings = createRatings(1);
    ratings.retaliationSafetyRisk = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.63);
  });

  test('RISK-014 | Pervasiveness/control breakdown uses 8% weight', () => {
    const ratings = createRatings(1);
    ratings.controlBreakdown = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.72);
  });

  test('RISK-015 | Credibility uses 4% weight', () => {
    const ratings = createRatings(1);
    ratings.credibility = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.36);
  });

  test('RISK-016 | Recurrence/suppression uses 3% weight', () => {
    const ratings = createRatings(1);
    ratings.recurrenceSuppression = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.27);
  });

  test('RISK-017 | Investigation complexity uses 3% weight', () => {
    const ratings = createRatings(1);
    ratings.investigationComplexity = 10;

    expect(calculateWeightedScore(ratings)).toBe(1.27);
  });

  test('RISK-018 | Criterion weights total exactly 100%', () => {
    const totalWeight = Object.values(WEIGHTS)
      .reduce((sum, weight) => sum + weight, 0);

    expect(totalWeight).toBe(100);
  });

  test('RISK-019 | Minimum possible weighted score is 1.00', () => {
    expect(calculateWeightedScore(createRatings(1))).toBe(1.00);
  });

  test('RISK-020 | Maximum possible weighted score is 10.00', () => {
    expect(calculateWeightedScore(createRatings(10))).toBe(10.00);
  });

  test.describe('Priority band boundaries', () => {
    const cases: Array<{
      id: string;
      score: number;
      expected: Priority;
    }> = [
      { id: 'RISK-021', score: 1.00, expected: 'Low' },
      { id: 'RISK-022', score: 2.49, expected: 'Low' },
      { id: 'RISK-023', score: 2.50, expected: 'Medium' },
      { id: 'RISK-024', score: 4.49, expected: 'Medium' },
      { id: 'RISK-025', score: 4.50, expected: 'High' },
      { id: 'RISK-026', score: 6.99, expected: 'High' },
      { id: 'RISK-027', score: 7.00, expected: 'Critical' },
      { id: 'RISK-028', score: 10.00, expected: 'Critical' },
    ];

    for (const scenario of cases) {
      test(
        `${scenario.id} | Score ${scenario.score.toFixed(2)} -> ${scenario.expected}`,
        () => {
          expect(getCalculatedPriority(scenario.score))
            .toBe(scenario.expected);
        }
      );
    }
  });

  test.describe('Automatic Critical priority triggers', () => {
    const cases: Array<{
      id: string;
      name: string;
      trigger: keyof OverrideTriggers;
      calculatedPriority: Priority;
    }> = [
      {
        id: 'RISK-029',
        name: 'C-Level / CEO / Board',
        trigger: 'cLevelCeoOrBoard',
        calculatedPriority: 'Low',
      },
      {
        id: 'RISK-030',
        name: 'Active regulator / law enforcement',
        trigger: 'activeRegulatorOrLawEnforcement',
        calculatedPriority: 'Low',
      },
      {
        id: 'RISK-031',
        name: 'Major public/media impact',
        trigger: 'majorPublicMediaImpact',
        calculatedPriority: 'Medium',
      },
      {
        id: 'RISK-032',
        name: 'Immediate evidence destruction risk',
        trigger: 'immediateEvidenceDestructionRisk',
        calculatedPriority: 'Low',
      },
      {
        id: 'RISK-033',
        name: 'Sexual harassment',
        trigger: 'sexualHarassment',
        calculatedPriority: 'Medium',
      },
      {
        id: 'RISK-034',
        name: 'Critical trigger from calculated High',
        trigger: 'sexualHarassment',
        calculatedPriority: 'High',
      },
      {
        id: 'RISK-035',
        name: 'Critical trigger keeps calculated Critical',
        trigger: 'cLevelCeoOrBoard',
        calculatedPriority: 'Critical',
      },
    ];

    for (const scenario of cases) {
      test(`${scenario.id} | ${scenario.name} -> Critical`, () => {
        const triggers: OverrideTriggers = {
          [scenario.trigger]: true,
        };

        expect(
          getFinalPriority(scenario.calculatedPriority, triggers)
        ).toBe('Critical');
      });
    }
  });

  test.describe('Automatic High priority triggers', () => {
    const cases: Array<{
      id: string;
      name: string;
      trigger: keyof OverrideTriggers;
      calculatedPriority: Priority;
      expected: Priority;
    }> = [
      {
        id: 'RISK-036',
        name: 'Director to Senior Executive Director from Low',
        trigger: 'directorToSeniorExecutiveDirector',
        calculatedPriority: 'Low',
        expected: 'High',
      },
      {
        id: 'RISK-037',
        name: 'Director to Senior Executive Director from Medium',
        trigger: 'directorToSeniorExecutiveDirector',
        calculatedPriority: 'Medium',
        expected: 'High',
      },
      {
        id: 'RISK-038',
        name: 'Retaliation from Low',
        trigger: 'retaliation',
        calculatedPriority: 'Low',
        expected: 'High',
      },
      {
        id: 'RISK-039',
        name: 'Actual Conflict of Interest from Medium',
        trigger: 'actualConflictOfInterest',
        calculatedPriority: 'Medium',
        expected: 'High',
      },
      {
        id: 'RISK-040',
        name: 'Cross-functional/departmental from Low',
        trigger: 'crossFunctionalDepartmental',
        calculatedPriority: 'Low',
        expected: 'High',
      },
      {
        id: 'RISK-041',
        name: 'High trigger keeps calculated High',
        trigger: 'retaliation',
        calculatedPriority: 'High',
        expected: 'High',
      },
      {
        id: 'RISK-042',
        name: 'High trigger must not downgrade Critical',
        trigger: 'retaliation',
        calculatedPriority: 'Critical',
        expected: 'Critical',
      },
    ];

    for (const scenario of cases) {
      test(`${scenario.id} | ${scenario.name}`, () => {
        const triggers: OverrideTriggers = {
          [scenario.trigger]: true,
        };

        expect(
          getFinalPriority(scenario.calculatedPriority, triggers)
        ).toBe(scenario.expected);
      });
    }
  });

  test.describe('Override precedence', () => {

    test('RISK-043 | No trigger uses calculated priority', () => {
      expect(getFinalPriority('Medium', {})).toBe('Medium');
    });

    test('RISK-044 | Critical trigger wins over High trigger', () => {
      expect(
        getFinalPriority('Low', {
          retaliation: true,
          sexualHarassment: true,
        })
      ).toBe('Critical');
    });

    test('RISK-045 | Multiple Critical triggers still produce Critical', () => {
      expect(
        getFinalPriority('Low', {
          cLevelCeoOrBoard: true,
          activeRegulatorOrLawEnforcement: true,
          immediateEvidenceDestructionRisk: true,
        })
      ).toBe('Critical');
    });

    test('RISK-046 | Multiple High triggers produce at least High', () => {
      expect(
        getFinalPriority('Medium', {
          retaliation: true,
          actualConflictOfInterest: true,
          crossFunctionalDepartmental: true,
        })
      ).toBe('High');
    });

    test('RISK-047 | Low calculated + High trigger -> High', () => {
      expect(
        getFinalPriority('Low', {
          retaliation: true,
        })
      ).toBe('High');
    });

    test('RISK-048 | Low calculated + Critical trigger -> Critical', () => {
      expect(
        getFinalPriority('Low', {
          sexualHarassment: true,
        })
      ).toBe('Critical');
    });

    test('RISK-049 | Medium + High + Critical triggers -> Critical', () => {
      expect(
        getFinalPriority('Medium', {
          retaliation: true,
          activeRegulatorOrLawEnforcement: true,
        })
      ).toBe('Critical');
    });

    test('RISK-050 | Calculated Critical with no trigger remains Critical', () => {
      expect(getFinalPriority('Critical', {})).toBe('Critical');
    });
  });

  test.describe('Validation', () => {

    test('RISK-VAL-001 | Reject score below 1.00', () => {
      expect(() => getCalculatedPriority(0.99))
        .toThrow(/between 1\.00 and 10\.00/);
    });

    test('RISK-VAL-002 | Reject score above 10.00', () => {
      expect(() => getCalculatedPriority(10.01))
        .toThrow(/between 1\.00 and 10\.00/);
    });
  });
});
