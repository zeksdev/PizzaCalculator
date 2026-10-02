import { calculateQuantities, proofingTimeline, type DoughInputs } from './dough/dough';
import { formatGrams, formatPercent } from './format';
import { strings } from './strings';

/** Ingredient lines, formatted exactly as on the Quantities screen. */
export function ingredientLines(inputs: DoughInputs) {
  const q = calculateQuantities(inputs);
  return [
    { key: 'flour', name: strings.flour, amount: formatGrams(q.flourGrams), percent: formatPercent(100) },
    { key: 'water', name: strings.water, amount: formatGrams(q.waterGrams), percent: formatPercent(inputs.hydrationPercent) },
    { key: 'salt', name: strings.salt, amount: formatGrams(q.saltGrams, 1), percent: formatPercent(inputs.saltPercent) },
    {
      key: 'yeast',
      name: strings.yeastIngredient(inputs.yeastType),
      amount: formatGrams(q.yeastGrams, 2),
      percent: formatPercent(inputs.yeastPercent),
    },
  ] as const;
}

export function totalDoughText(inputs: DoughInputs): string {
  return formatGrams(calculateQuantities(inputs).totalDoughGrams);
}

export function shareText(inputs: DoughInputs): string {
  const { totalHours } = proofingTimeline(inputs.proofingSchedule);
  return [
    strings.shareTitle,
    strings.shareBatch(inputs.ballCount, inputs.ballWeightGrams),
    strings.shareProofing(inputs.proofingSchedule, totalHours),
    '',
    ...ingredientLines(inputs).map(({ name, amount, percent }) => `${name}: ${amount} (${percent})`),
    `${strings.totalDough}: ${totalDoughText(inputs)}`,
  ].join('\n');
}
