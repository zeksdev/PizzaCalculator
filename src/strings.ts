import type { ProofingSchedule, YeastType } from './dough/dough';
import { formatGrams, formatPercent } from './format';

// All UI text, Serbian (Latin script).

/** Serbian plural for Dough balls: 1 loptica, 2–4 loptice, 5+ loptica (21 loptica, 22 loptice, 12–14 loptica). */
export function ballCountLabel(count: number): string {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  const form = lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'loptice' : 'loptica';
  return `${count} ${form}`;
}

const yeastTypeLabels: Record<YeastType, string> = {
  fresh: 'Sveži',
  activeDry: 'Aktivni suvi',
  instantDry: 'Instant suvi',
};

const proofingScheduleLabels: Record<ProofingSchedule, string> = {
  sameDay: 'Isti dan',
  nextDay: 'Sledeći dan',
  '48h': '48h',
  '72h': '72h',
};

export const strings = {
  appName: 'Moja Pizza',
  resetDefaults: 'Vrati podrazumevane vrednosti',
  backToCalculator: 'Nazad na kalkulator',
  mainNavigation: 'Glavna navigacija',
  tabCalculator: 'Kalkulator',
  tabRecipe: 'Recept',

  sectionDough: 'Testo',
  ballCount: 'Broj loptica',
  ballCountDecrement: 'Manje loptica',
  ballCountIncrement: 'Više loptica',
  ballWeight: 'Težina loptice',
  ballWeightDecrement: 'Smanji za 10 g',
  ballWeightIncrement: 'Povećaj za 10 g',
  sectionYeastType: 'Vrsta kvasca',
  yeastTypeLabel: (type: YeastType) => yeastTypeLabels[type],
  sectionProofing: 'Fermentacija',
  proofingScheduleLabel: (schedule: ProofingSchedule) => proofingScheduleLabels[schedule],
  proofingCaption: (coldHours: number, roomHours: number) =>
    coldHours === 0
      ? `${roomHours}h na sobnoj temperaturi`
      : `${coldHours}h u frižideru, zatim ${roomHours}h na sobnoj temperaturi`,

  advancedSettings: 'Napredna podešavanja',
  advancedSummary: (yeastPercent: number, hydrationPercent: number, saltPercent: number) =>
    `Kvasac ${formatPercent(yeastPercent)} · Hidratacija ${formatPercent(hydrationPercent)} · So ${formatPercent(saltPercent)}`,
  sectionPercentages: 'Procenti',
  yeastPercent: 'Kvasac',
  yeastPercentDecrement: 'Smanji kvasac za 0,01%',
  yeastPercentIncrement: 'Povećaj kvasac za 0,01%',
  yeastRecommendation: (type: YeastType) => `Preporuka za ${yeastTypeLabels[type]} je `,
  hydration: 'Hidratacija',
  hydrationDecrement: 'Smanji hidrataciju',
  hydrationIncrement: 'Povećaj hidrataciju',
  salt: 'So',
  saltDecrement: 'Smanji so',
  saltIncrement: 'Povećaj so',
  atMinimum: (value: string) => `Najmanje ${value}`,
  atMaximum: (value: string) => `Najviše ${value}`,
  calculate: 'Izračunaj',

  quantitiesTitle: 'Količine',
  summaryProofing: (totalHours: number) => `${totalHours}h fermentacija`,
  sectionIngredients: 'Sastojci',
  edit: 'Izmeni',
  flour: 'Brašno',
  flourNote: 'min. 12% proteina',
  water: 'Voda',
  yeastIngredient: (type: YeastType) => `${yeastTypeLabels[type]} kvasac`,
  totalDough: 'Ukupno testo',
  coldProof: (hours: number) => `${hours}h hladna fermentacija (1–5 °C)`,
  roomProof: (hours: number, withColdProof: boolean) =>
    withColdProof ? `${hours}h na sobnoj temperaturi (20–23 °C)` : `${hours}h na sobnoj temperaturi`,
  share: 'Podeli',
  viewRecipe: 'Pogledaj recept',
  copiedToClipboard: 'Količine su kopirane u klipbord',
  shareTitle: 'Testo za picu',
  shareBatch: (ballCount: number, ballWeightGrams: number) =>
    `${ballCountLabel(ballCount)} × ${formatGrams(ballWeightGrams)}`,
  shareProofing: (schedule: ProofingSchedule, totalHours: number) =>
    `Fermentacija: ${proofingScheduleLabels[schedule]} (${totalHours}h ukupno)`,

  recipeTitle: 'Testo za picu',
  recipeSubtitle: '8 koraka · količine i vreme fermentacije su u kalkulatoru',
  recipeStepPhoto: (step: number) => `Fotografija za korak ${step}`,
  recipeSteps: [
    'Sipaj brašno u veliku činiju, dodaj kvasac i so i promešaj rukom.',
    'Postepeno dodaj vrlo hladnu vodu.',
    'Mesi u činiji dok se svi sastojci ne sjedine.',
    'Prebaci testo na čistu, glatku površinu i mesi dok ne postane glatko i elastično.',
    'Podeli testo na loptice zadate težine i oblikuj ih.',
    'Pokrij loptice providnom folijom i stavi u frižider (hladna fermentacija).',
    'Pre pečenja ostavi loptice na sobnoj temperaturi.',
    'Razvuci testo rukama.',
  ],
};
