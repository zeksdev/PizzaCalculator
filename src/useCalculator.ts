import { useEffect, useState } from 'react';
import {
  DEFAULT_INPUTS,
  LIMITS,
  PROOFING_SCHEDULES,
  recommendedYeastPercent,
  YEAST_TYPES,
  type DoughInputs,
  type Limit,
  type ProofingSchedule,
  type YeastType,
} from './dough/dough';

export type NumericField = keyof typeof LIMITS;

const STORAGE_KEY = 'moja-pizza.inputs.v1';

function decimalsOf(step: number): number {
  return (String(step).split('.')[1] ?? '').length;
}

/** Clamps to the field's limits and rounds to the precision of its step. */
export function clampToLimit(value: number, limit: Limit): number {
  const clamped = Math.min(limit.max, Math.max(limit.min, value));
  return Number(clamped.toFixed(decimalsOf(limit.step)));
}

function isValidInputs(value: unknown): value is DoughInputs {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const numericOk = (Object.keys(LIMITS) as NumericField[]).every((field) => {
    const n = v[field];
    return typeof n === 'number' && Number.isFinite(n) && n >= LIMITS[field].min && n <= LIMITS[field].max;
  });
  return (
    numericOk &&
    YEAST_TYPES.includes(v.yeastType as YeastType) &&
    PROOFING_SCHEDULES.includes(v.proofingSchedule as ProofingSchedule)
  );
}

function loadInputs(): DoughInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_INPUTS;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidInputs(parsed)) return DEFAULT_INPUTS;
    const { ballCount, ballWeightGrams, yeastType, proofingSchedule, yeastPercent, hydrationPercent, saltPercent } = parsed;
    return { ballCount, ballWeightGrams, yeastType, proofingSchedule, yeastPercent, hydrationPercent, saltPercent };
  } catch {
    return DEFAULT_INPUTS;
  }
}

function saveInputs(inputs: DoughInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {
    // Storage unavailable (private mode, quota): the app still works, it just won't remember.
  }
}

export interface Calculator {
  inputs: DoughInputs;
  setNumber: (field: NumericField, value: number) => void;
  setYeastType: (yeastType: YeastType) => void;
  setProofingSchedule: (schedule: ProofingSchedule) => void;
  resetToDefaults: () => void;
}

export function useCalculator(): Calculator {
  const [inputs, setInputs] = useState<DoughInputs>(loadInputs);

  useEffect(() => saveInputs(inputs), [inputs]);

  return {
    inputs,
    setNumber: (field, value) => setInputs((prev) => ({ ...prev, [field]: clampToLimit(value, LIMITS[field]) })),
    // Changing Yeast type or Proofing schedule discards a yeast override.
    setYeastType: (yeastType) =>
      setInputs((prev) => ({ ...prev, yeastType, yeastPercent: recommendedYeastPercent(prev.proofingSchedule, yeastType) })),
    setProofingSchedule: (proofingSchedule) =>
      setInputs((prev) => ({ ...prev, proofingSchedule, yeastPercent: recommendedYeastPercent(proofingSchedule, prev.yeastType) })),
    resetToDefaults: () => setInputs(DEFAULT_INPUTS),
  };
}
