import { describe, expect, it } from 'vitest';
import {
  calculateQuantities,
  DEFAULT_INPUTS,
  proofingTimeline,
  recommendedYeastPercent,
  type ProofingSchedule,
  type YeastType,
} from './dough';

describe('calculateQuantities', () => {
  it('reproduces the source recipe: 6 × 280 g, 65%, 3%, 0,10% → 1000 / 650 / 30 / 1 g', () => {
    const q = calculateQuantities(DEFAULT_INPUTS);
    expect(q.flourGrams).toBeCloseTo(1000, 9);
    expect(q.waterGrams).toBeCloseTo(650, 9);
    expect(q.saltGrams).toBeCloseTo(30, 9);
    expect(q.yeastGrams).toBeCloseTo(1, 9);
  });

  it('excludes yeast from Ball weight: the Batch weighs balls × Ball weight + yeast (ADR 0001)', () => {
    expect(calculateQuantities(DEFAULT_INPUTS).totalDoughGrams).toBeCloseTo(1681, 9);
  });

  // Expected values worked out by hand from the ADR 0001 formula.
  it.each([
    { name: '1 ball of 150 g', ballCount: 1, ballWeightGrams: 150, hydrationPercent: 65, saltPercent: 3, yeastPercent: 0.1,
      flour: 89.285714, water: 58.035714, salt: 2.678571, yeast: 0.089286, total: 150.089286 },
    { name: '50 balls of 500 g', ballCount: 50, ballWeightGrams: 500, hydrationPercent: 65, saltPercent: 3, yeastPercent: 0.1,
      flour: 14880.952381, water: 9672.619048, salt: 446.428571, yeast: 14.880952, total: 25014.880952 },
    { name: 'maximum percentages', ballCount: 6, ballWeightGrams: 280, hydrationPercent: 80, saltPercent: 4, yeastPercent: 3,
      flour: 913.043478, water: 730.434783, salt: 36.521739, yeast: 27.391304, total: 1707.391304 },
    { name: 'minimum percentages', ballCount: 6, ballWeightGrams: 280, hydrationPercent: 50, saltPercent: 1.5, yeastPercent: 0.01,
      flour: 1108.910891, water: 554.455446, salt: 16.633663, yeast: 0.110891, total: 1680.110891 },
  ])('$name', ({ flour, water, salt, yeast, total, name: _name, ...overrides }) => {
    const q = calculateQuantities({ ...DEFAULT_INPUTS, ...overrides });
    expect(q.flourGrams).toBeCloseTo(flour, 5);
    expect(q.waterGrams).toBeCloseTo(water, 5);
    expect(q.saltGrams).toBeCloseTo(salt, 5);
    expect(q.yeastGrams).toBeCloseTo(yeast, 5);
    expect(q.totalDoughGrams).toBeCloseTo(total, 5);
  });
});

describe('recommendedYeastPercent', () => {
  it.each<[ProofingSchedule, YeastType, number]>([
    ['sameDay', 'instantDry', 0.2],
    ['sameDay', 'fresh', 0.6],
    ['sameDay', 'activeDry', 0.24],
    ['nextDay', 'instantDry', 0.13],
    ['nextDay', 'fresh', 0.39],
    ['nextDay', 'activeDry', 0.16],
    ['48h', 'instantDry', 0.11],
    ['48h', 'fresh', 0.33],
    ['48h', 'activeDry', 0.13],
    ['72h', 'instantDry', 0.1],
    ['72h', 'fresh', 0.3],
    ['72h', 'activeDry', 0.12],
  ])('%s with %s yeast → %s%', (schedule, yeastType, expected) => {
    expect(recommendedYeastPercent(schedule, yeastType)).toBe(expected);
  });
});

describe('proofingTimeline', () => {
  it.each<[ProofingSchedule, number, number, number]>([
    ['sameDay', 0, 8, 8],
    ['nextDay', 24, 2, 26],
    ['48h', 48, 2, 50],
    ['72h', 72, 2, 74],
  ])('%s → %ih cold + %ih room = %ih', (schedule, coldHours, roomHours, totalHours) => {
    expect(proofingTimeline(schedule)).toEqual({ coldHours, roomHours, totalHours });
  });
});
