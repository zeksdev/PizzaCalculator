export type YeastType = 'fresh' | 'activeDry' | 'instantDry';
export type ProofingSchedule = 'sameDay' | 'nextDay' | '48h' | '72h';

export interface DoughInputs {
  ballCount: number;
  ballWeightGrams: number;
  yeastType: YeastType;
  proofingSchedule: ProofingSchedule;
  /** Baker's percentages, e.g. 65 for 65%. */
  yeastPercent: number;
  hydrationPercent: number;
  saltPercent: number;
}

export interface Quantities {
  flourGrams: number;
  waterGrams: number;
  saltGrams: number;
  yeastGrams: number;
  totalDoughGrams: number;
}

export const DEFAULT_INPUTS: DoughInputs = {
  ballCount: 6,
  ballWeightGrams: 280,
  yeastType: 'instantDry',
  proofingSchedule: '72h',
  yeastPercent: 0.1,
  hydrationPercent: 65,
  saltPercent: 3,
};

/** Ball weight excludes yeast (ADR 0001): yeast is added on top of balls × ballWeight. */
export function calculateQuantities(inputs: DoughInputs): Quantities {
  const hydration = inputs.hydrationPercent / 100;
  const salt = inputs.saltPercent / 100;
  const flourGrams = (inputs.ballCount * inputs.ballWeightGrams) / (1 + hydration + salt);
  const waterGrams = flourGrams * hydration;
  const saltGrams = flourGrams * salt;
  const yeastGrams = (flourGrams * inputs.yeastPercent) / 100;
  return {
    flourGrams,
    waterGrams,
    saltGrams,
    yeastGrams,
    totalDoughGrams: flourGrams + waterGrams + saltGrams + yeastGrams,
  };
}

export const YEAST_TYPES: readonly YeastType[] = ['fresh', 'activeDry', 'instantDry'];
export const PROOFING_SCHEDULES: readonly ProofingSchedule[] = ['sameDay', 'nextDay', '48h', '72h'];

// Stored explicitly (Fresh = 3 × Instant dry, Active dry = 1,2 × Instant dry, rounded)
// so the values are exactly those of the spec.
const RECOMMENDED_YEAST_PERCENT: Record<ProofingSchedule, Record<YeastType, number>> = {
  sameDay: { instantDry: 0.2, fresh: 0.6, activeDry: 0.24 },
  nextDay: { instantDry: 0.13, fresh: 0.39, activeDry: 0.16 },
  '48h': { instantDry: 0.11, fresh: 0.33, activeDry: 0.13 },
  '72h': { instantDry: 0.1, fresh: 0.3, activeDry: 0.12 },
};

export function recommendedYeastPercent(schedule: ProofingSchedule, yeastType: YeastType): number {
  return RECOMMENDED_YEAST_PERCENT[schedule][yeastType];
}

export interface ProofingTimeline {
  coldHours: number;
  roomHours: number;
  totalHours: number;
}

const COLD_HOURS: Record<ProofingSchedule, number> = { sameDay: 0, nextDay: 24, '48h': 48, '72h': 72 };

export function proofingTimeline(schedule: ProofingSchedule): ProofingTimeline {
  const coldHours = COLD_HOURS[schedule];
  const roomHours = coldHours === 0 ? 8 : 2;
  return { coldHours, roomHours, totalHours: coldHours + roomHours };
}

export interface Limit {
  min: number;
  max: number;
  step: number;
}

export const LIMITS = {
  ballCount: { min: 1, max: 50, step: 1 },
  ballWeightGrams: { min: 150, max: 500, step: 10 },
  yeastPercent: { min: 0.01, max: 3, step: 0.01 },
  hydrationPercent: { min: 50, max: 80, step: 1 },
  saltPercent: { min: 1.5, max: 4, step: 0.1 },
} as const satisfies Record<string, Limit>;
