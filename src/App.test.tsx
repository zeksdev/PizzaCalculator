import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

function setup() {
  const user = userEvent.setup();
  render(<App />);
  return { user };
}

function ingredientRow(name: RegExp | string) {
  const list = screen.getByRole('list', { name: 'Sastojci' });
  return within(list).getByText(name).closest('li') as HTMLElement;
}

describe('Calculator → Quantities', () => {
  it('shows the source recipe Quantities for the defaults', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));

    expect(screen.getByRole('heading', { name: 'Količine' })).toBeInTheDocument();
    expect(ingredientRow('Brašno')).toHaveTextContent(/min\. 12% proteina.*1000 g.*100%/);
    expect(ingredientRow('Voda')).toHaveTextContent(/650 g.*65%/);
    expect(ingredientRow('So')).toHaveTextContent(/30,0 g.*3%/);
    expect(ingredientRow('Instant suvi kvasac')).toHaveTextContent(/1,00 g.*0,1%/);
    expect(screen.getByText('Ukupno testo').parentElement).toHaveTextContent('1681 g');
  });

  it('scales the Batch with the − / + steppers', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Manje loptica' }));
    await user.click(screen.getByRole('button', { name: 'Manje loptica' }));
    await user.click(screen.getByRole('button', { name: 'Povećaj za 10 g' }));
    expect(screen.getByLabelText('Broj loptica')).toHaveValue('4');
    expect(screen.getByLabelText('Težina loptice')).toHaveValue('290 g');

    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    // 4 × 290 g / 1,68 = 690,476 g flour
    expect(ingredientRow('Brašno')).toHaveTextContent('690 g');
    expect(ingredientRow('Voda')).toHaveTextContent('449 g');
    expect(ingredientRow('So')).toHaveTextContent('20,7 g');
    expect(ingredientRow('Instant suvi kvasac')).toHaveTextContent('0,69 g');
    expect(screen.getByText('Ukupno testo').parentElement).toHaveTextContent('1161 g');
  });

  it('accepts typed values', async () => {
    const { user } = setup();
    await user.clear(screen.getByLabelText('Broj loptica'));
    await user.type(screen.getByLabelText('Broj loptica'), '12');
    await user.clear(screen.getByLabelText('Težina loptice'));
    await user.type(screen.getByLabelText('Težina loptice'), '265');
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    // 12 × 265 g / 1,68 = 1892,857 g flour
    expect(ingredientRow('Brašno')).toHaveTextContent('1893 g');
  });

  it('Izmeni returns to the Calculator with the inputs intact', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Više loptica' }));
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    await user.click(await screen.findByRole('link', { name: 'Izmeni' }));
    expect(await screen.findByLabelText('Broj loptica')).toHaveValue('7');
    expect(screen.getByLabelText('Težina loptice')).toHaveValue('280 g');
  });

  it('the back button returns to the Calculator', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    await user.click(screen.getByRole('link', { name: 'Nazad na kalkulator' }));
    expect(await screen.findByRole('button', { name: 'Izračunaj' })).toBeInTheDocument();
  });
});

describe('Yeast type and Proofing schedule', () => {
  function segment(group: string, name: string) {
    return within(screen.getByRole('group', { name: group })).getByRole('button', { name });
  }

  it('defaults to Instant suvi and 72h', () => {
    setup();
    expect(segment('Vrsta kvasca', 'Instant suvi')).toHaveAttribute('aria-pressed', 'true');
    expect(segment('Vrsta kvasca', 'Sveži')).toHaveAttribute('aria-pressed', 'false');
    expect(segment('Fermentacija', '72h')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('72h u frižideru, zatim 2h na sobnoj temperaturi')).toBeInTheDocument();
  });

  it('shows the default summary bar and timeline', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    expect(screen.getByText('74h fermentacija')).toBeInTheDocument();
    expect(screen.getByText('280 g')).toBeInTheDocument();
    expect(screen.getByText('6 loptica')).toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: 'Fermentacija' });
    expect(within(timeline).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '72h hladna fermentacija (1–5 °C)',
      '2h na sobnoj temperaturi (20–23 °C)',
    ]);
  });

  it('uses the recommended yeast for Isti dan with Sveži yeast, with a room-only timeline', async () => {
    const { user } = setup();
    await user.click(segment('Vrsta kvasca', 'Sveži'));
    await user.click(segment('Fermentacija', 'Isti dan'));
    expect(segment('Fermentacija', 'Isti dan')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('8h na sobnoj temperaturi')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    // 1000 g flour × 0,6%
    expect(ingredientRow('Sveži kvasac')).toHaveTextContent(/6,00 g.*0,6%/);
    expect(screen.getByText('8h fermentacija')).toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: 'Fermentacija' });
    expect(within(timeline).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['8h na sobnoj temperaturi']);
  });

  it.each([
    ['Sledeći dan', 'Aktivni suvi', '1,60 g', '0,16%', '26h fermentacija', '24h hladna fermentacija (1–5 °C)'],
    ['48h', 'Instant suvi', '1,10 g', '0,11%', '50h fermentacija', '48h hladna fermentacija (1–5 °C)'],
  ])('%s with %s yeast → %s', async (schedule, yeastType, grams, percent, summary, coldRow) => {
    const { user } = setup();
    await user.click(segment('Vrsta kvasca', yeastType));
    await user.click(segment('Fermentacija', schedule));
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    expect(ingredientRow(`${yeastType} kvasac`)).toHaveTextContent(`${grams}${percent}`);
    expect(screen.getByText(summary)).toBeInTheDocument();
    expect(screen.getByText(coldRow)).toBeInTheDocument();
  });

  it.each([
    [1, '1 loptica'],
    [4, '4 loptice'],
    [12, '12 loptica'],
    [21, '21 loptica'],
    [22, '22 loptice'],
  ])('summary bar uses the Serbian plural for %i balls', async (count, label) => {
    const { user } = setup();
    await user.clear(screen.getByLabelText('Broj loptica'));
    await user.type(screen.getByLabelText('Broj loptica'), String(count));
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe('Napredna podešavanja', () => {
  async function openAdvanced(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: /Napredna podešavanja/ }));
  }
  function segment(group: string, name: string) {
    return within(screen.getByRole('group', { name: group })).getByRole('button', { name });
  }
  async function typeInto(user: ReturnType<typeof userEvent.setup>, label: string, text: string) {
    const input = screen.getByLabelText(label);
    await user.clear(input);
    await user.type(input, text);
    await user.tab();
  }

  it('is collapsed by default and summarises the current percentages', async () => {
    const { user } = setup();
    const toggle = screen.getByRole('button', { name: /Napredna podešavanja/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveTextContent('Kvasac 0,1% · Hidratacija 65% · So 3%');
    expect(screen.queryByLabelText('Hidratacija')).not.toBeInTheDocument();

    await openAdvanced(user);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { name: 'Procenti' })).toBeInTheDocument();
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,1%');
    expect(screen.getByLabelText('Hidratacija')).toHaveValue('65%');
    expect(screen.getByLabelText('So')).toHaveValue('3%');
  });

  it('hints the Recommended yeast percentage for the current Yeast type and Proofing schedule', async () => {
    const { user } = setup();
    await openAdvanced(user);
    expect(screen.getByText(/Preporuka za Instant suvi je/)).toHaveTextContent('Preporuka za Instant suvi je 0,1%');
    await user.click(segment('Vrsta kvasca', 'Aktivni suvi'));
    await user.click(segment('Fermentacija', 'Sledeći dan'));
    expect(screen.getByText(/Preporuka za/)).toHaveTextContent('Preporuka za Aktivni suvi je 0,16%');
  });

  it('reflects changed percentages in the Quantities', async () => {
    const { user } = setup();
    await openAdvanced(user);
    await user.click(screen.getByRole('button', { name: 'Povećaj kvasac za 0,01%' }));
    await user.click(screen.getByRole('button', { name: 'Smanji hidrataciju' }));
    await user.click(screen.getByRole('button', { name: 'Povećaj so' }));
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,11%');
    expect(screen.getByLabelText('Hidratacija')).toHaveValue('64%');
    expect(screen.getByLabelText('So')).toHaveValue('3,1%');

    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    // 1680 g / 1,671 = 1005,386 g flour
    expect(ingredientRow('Brašno')).toHaveTextContent('1005 g');
    expect(ingredientRow('Voda')).toHaveTextContent(/643 g.*64%/);
    expect(ingredientRow('So')).toHaveTextContent(/31,2 g.*3,1%/);
    expect(ingredientRow('Instant suvi kvasac')).toHaveTextContent(/1,11 g.*0,11%/);
  });

  it('resets an overridden yeast % on Proofing schedule change', async () => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, 'Kvasac', '0,25');
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,25%');
    await user.click(segment('Fermentacija', 'Sledeći dan'));
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,13%');
  });

  it('resets an overridden yeast % on Yeast type change', async () => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, 'Kvasac', '0,25');
    await user.click(segment('Vrsta kvasca', 'Sveži'));
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,3%');
  });

  it('accepts a decimal comma and a decimal dot', async () => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, 'Kvasac', '0,38');
    expect(screen.getByLabelText('Kvasac')).toHaveValue('0,38%');
    await typeInto(user, 'So', '2.5');
    expect(screen.getByLabelText('So')).toHaveValue('2,5%');
  });

  it.each([
    ['Broj loptica', '0', '1', 'Najmanje 1'],
    ['Broj loptica', '99', '50', 'Najviše 50'],
    ['Težina loptice', '100', '150 g', 'Najmanje 150 g'],
    ['Težina loptice', '900', '500 g', 'Najviše 500 g'],
    ['Kvasac', '0', '0,01%', 'Najmanje 0,01%'],
    ['Kvasac', '5', '3%', 'Najviše 3%'],
    ['Hidratacija', '40', '50%', 'Najmanje 50%'],
    ['Hidratacija', '95', '80%', 'Najviše 80%'],
    ['So', '1', '1,5%', 'Najmanje 1,5%'],
    ['So', '4,5', '4%', 'Najviše 4%'],
  ])('clamps %s typed as %s to %s on blur', async (label, typed, shown, caption) => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, label, typed);
    expect(screen.getByLabelText(label)).toHaveValue(shown);
    expect(screen.getByText(caption)).toBeInTheDocument();
  });

  it('keeps the previous value when the typed text is not a number', async () => {
    const { user } = setup();
    await typeInto(user, 'Težina loptice', 'abc');
    expect(screen.getByLabelText('Težina loptice')).toHaveValue('280 g');
  });

  it.each([
    ['Broj loptica', '1', 'Manje loptica', 'Više loptica'],
    ['Broj loptica', '50', 'Više loptica', 'Manje loptica'],
    ['Težina loptice', '150', 'Smanji za 10 g', 'Povećaj za 10 g'],
    ['Težina loptice', '500', 'Povećaj za 10 g', 'Smanji za 10 g'],
    ['Kvasac', '0,01', 'Smanji kvasac za 0,01%', 'Povećaj kvasac za 0,01%'],
    ['Kvasac', '3', 'Povećaj kvasac za 0,01%', 'Smanji kvasac za 0,01%'],
    ['Hidratacija', '50', 'Smanji hidrataciju', 'Povećaj hidrataciju'],
    ['Hidratacija', '80', 'Povećaj hidrataciju', 'Smanji hidrataciju'],
    ['So', '1,5', 'Smanji so', 'Povećaj so'],
    ['So', '4', 'Povećaj so', 'Smanji so'],
  ])('at %s = %s, "%s" is disabled and "%s" is not', async (label, typed, disabledButton, enabledButton) => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, label, typed);
    expect(screen.getByRole('button', { name: disabledButton })).toBeDisabled();
    expect(screen.getByRole('button', { name: enabledButton })).toBeEnabled();
  });

  it('steps salt up to its maximum and disables +', async () => {
    const { user } = setup();
    await openAdvanced(user);
    await typeInto(user, 'So', '3,8');
    await user.click(screen.getByRole('button', { name: 'Povećaj so' }));
    await user.click(screen.getByRole('button', { name: 'Povećaj so' }));
    expect(screen.getByLabelText('So')).toHaveValue('4%');
    expect(screen.getByRole('button', { name: 'Povećaj so' })).toBeDisabled();
    expect(screen.getByText('Najviše 4%')).toBeInTheDocument();
  });
});

describe('Remembering inputs', () => {
  async function changeEverything(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole('button', { name: 'Više loptica' }));
    await user.click(screen.getByRole('button', { name: 'Smanji za 10 g' }));
    await user.click(within(screen.getByRole('group', { name: 'Vrsta kvasca' })).getByRole('button', { name: 'Sveži' }));
    await user.click(within(screen.getByRole('group', { name: 'Fermentacija' })).getByRole('button', { name: '48h' }));
    await user.click(screen.getByRole('button', { name: /Napredna podešavanja/ }));
    await user.click(screen.getByRole('button', { name: 'Povećaj kvasac za 0,01%' }));
    await user.click(screen.getByRole('button', { name: 'Povećaj hidrataciju' }));
    await user.click(screen.getByRole('button', { name: 'Smanji so' }));
  }

  function expectAdvancedSummary(text: string) {
    expect(screen.getByRole('button', { name: /Napredna podešavanja/ })).toHaveTextContent(text);
  }

  function expectDefaults() {
    expect(screen.getByLabelText('Broj loptica')).toHaveValue('6');
    expect(screen.getByLabelText('Težina loptice')).toHaveValue('280 g');
    expect(within(screen.getByRole('group', { name: 'Vrsta kvasca' })).getByRole('button', { name: 'Instant suvi' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByRole('group', { name: 'Fermentacija' })).getByRole('button', { name: '72h' }))
      .toHaveAttribute('aria-pressed', 'true');
    expectAdvancedSummary('Kvasac 0,1% · Hidratacija 65% · So 3%');
  }

  it('starts with the defaults on first launch', () => {
    setup();
    expectDefaults();
  });

  it('restores the last inputs after the app is reopened', async () => {
    const { user } = setup();
    await changeEverything(user);
    cleanup();

    render(<App />);
    expect(screen.getByLabelText('Broj loptica')).toHaveValue('7');
    expect(screen.getByLabelText('Težina loptice')).toHaveValue('270 g');
    expect(within(screen.getByRole('group', { name: 'Vrsta kvasca' })).getByRole('button', { name: 'Sveži' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByRole('group', { name: 'Fermentacija' })).getByRole('button', { name: '48h' }))
      .toHaveAttribute('aria-pressed', 'true');
    expectAdvancedSummary('Kvasac 0,34% · Hidratacija 66% · So 2,9%');
  });

  it.each([
    ['not JSON', '{nope'],
    ['the wrong shape', JSON.stringify({ ballCount: 'six' })],
    ['out-of-range values', JSON.stringify({
      ballCount: 500, ballWeightGrams: 280, yeastType: 'instantDry', proofingSchedule: '72h',
      yeastPercent: 0.1, hydrationPercent: 65, saltPercent: 3,
    })],
    ['an unknown Yeast type', JSON.stringify({
      ballCount: 6, ballWeightGrams: 280, yeastType: 'sourdough', proofingSchedule: '72h',
      yeastPercent: 0.1, hydrationPercent: 65, saltPercent: 3,
    })],
  ])('falls back to the defaults when the stored data is %s', async (_, stored) => {
    // Use the app once so it stores its inputs, then corrupt whatever it stored.
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Više loptica' }));
    cleanup();
    for (const key of Object.keys(localStorage)) localStorage.setItem(key, stored);

    render(<App />);
    expectDefaults();
  });

  it('↻ restores the defaults, and they are remembered', async () => {
    const { user } = setup();
    await changeEverything(user);
    await user.click(screen.getByRole('button', { name: 'Vrati podrazumevane vrednosti' }));
    await user.click(screen.getByRole('button', { name: /Napredna podešavanja/ }));
    expectDefaults();
    cleanup();

    render(<App />);
    expectDefaults();
  });
});

describe('Recept', () => {
  const steps = [
    'Sipaj brašno u veliku činiju, dodaj kvasac i so i promešaj rukom.',
    'Postepeno dodaj vrlo hladnu vodu.',
    'Mesi u činiji dok se svi sastojci ne sjedine.',
    'Prebaci testo na čistu, glatku površinu i mesi dok ne postane glatko i elastično.',
    'Podeli testo na loptice zadate težine i oblikuj ih.',
    'Pokrij loptice providnom folijom i stavi u frižider (hladna fermentacija).',
    'Pre pečenja ostavi loptice na sobnoj temperaturi.',
    'Razvuci testo rukama.',
  ];

  async function openRecipeTab(user: ReturnType<typeof userEvent.setup>) {
    const nav = screen.getByRole('navigation', { name: 'Glavna navigacija' });
    await user.click(within(nav).getByRole('link', { name: 'Recept' }));
    await screen.findByRole('heading', { name: 'Testo za picu' });
  }

  it('shows the 8 steps in order, each with its photo', async () => {
    const { user } = setup();
    await openRecipeTab(user);
    expect(screen.getByText('8 koraka · količine i vreme fermentacije su u kalkulatoru')).toBeInTheDocument();

    const items = within(screen.getByRole('heading', { name: 'Testo za picu' }).closest('main')!).getAllByRole('listitem');
    expect(items.map((li) => li.textContent?.replace(/^\d/, ''))).toEqual(steps);
    items.forEach((li, index) => {
      const photo = within(li).getByRole('img', { name: `Fotografija za korak ${index + 1}` });
      expect(photo).toHaveAttribute('src', expect.stringMatching(new RegExp(`recept/korak-${index + 1}\\.jpg$`)));
    });
  });

  it('never mentions an hour duration', async () => {
    const { user } = setup();
    await openRecipeTab(user);
    for (const step of steps) expect(screen.getByText(step).textContent).not.toMatch(/\d+\s*(h|sat)/i);
  });

  it('marks the active tab, and switching tabs keeps the Calculator inputs', async () => {
    const { user } = setup();
    const nav = screen.getByRole('navigation', { name: 'Glavna navigacija' });
    expect(within(nav).getByRole('link', { name: 'Kalkulator' })).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Više loptica' }));
    await openRecipeTab(user);
    expect(within(nav).getByRole('link', { name: 'Recept' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Kalkulator' })).not.toHaveAttribute('aria-current');

    await user.click(within(nav).getByRole('link', { name: 'Kalkulator' }));
    expect(await screen.findByLabelText('Broj loptica')).toHaveValue('7');
  });

  it('Pogledaj recept on the Quantities opens the Recipe', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
    await user.click(screen.getByRole('link', { name: 'Pogledaj recept' }));
    expect(await screen.findByRole('heading', { name: 'Testo za picu' })).toBeInTheDocument();
  });
});

describe('Podeli', () => {
  const sveziIstiDan4x260 = [
    'Testo za picu',
    '4 loptice × 260 g',
    'Fermentacija: Isti dan (8h ukupno)',
    '',
    'Brašno (min. 12% proteina): 619 g (100%)',
    'Voda: 402 g (65%)',
    'So: 18,6 g (3%)',
    'Sveži kvasac: 3,71 g (0,6%)',
    'Ukupno testo: 1044 g',
  ].join('\n');

  async function quantitiesFor4x260SveziIstiDan(user: ReturnType<typeof userEvent.setup>) {
    await user.clear(screen.getByLabelText('Broj loptica'));
    await user.type(screen.getByLabelText('Broj loptica'), '4');
    await user.click(screen.getByRole('button', { name: 'Smanji za 10 g' }));
    await user.click(screen.getByRole('button', { name: 'Smanji za 10 g' }));
    await user.click(within(screen.getByRole('group', { name: 'Vrsta kvasca' })).getByRole('button', { name: 'Sveži' }));
    await user.click(within(screen.getByRole('group', { name: 'Fermentacija' })).getByRole('button', { name: 'Isti dan' }));
    await user.click(screen.getByRole('button', { name: 'Izračunaj' }));
  }

  afterEach(() => {
    delete (navigator as { share?: unknown }).share;
  });

  it('opens the share sheet with the Quantities as plain text', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    const { user } = setup();
    await quantitiesFor4x260SveziIstiDan(user);
    await user.click(screen.getByRole('button', { name: 'Podeli' }));

    expect(share).toHaveBeenCalledWith({ title: 'Testo za picu', text: sveziIstiDan4x260 });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('falls back to the clipboard when the share sheet fails', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Share failed', 'NotAllowedError'));
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    const { user } = setup();
    await quantitiesFor4x260SveziIstiDan(user);
    await user.click(screen.getByRole('button', { name: 'Podeli' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Količine su kopirane u klipbord');
    expect(await navigator.clipboard.readText()).toBe(sveziIstiDan4x260);
  });

  it('does nothing more when the share sheet is dismissed', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Share canceled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    const { user } = setup();
    await quantitiesFor4x260SveziIstiDan(user);
    await user.click(screen.getByRole('button', { name: 'Podeli' }));

    expect(share).toHaveBeenCalled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('copies the text to the clipboard and confirms when there is no share sheet', async () => {
    // jsdom has no share sheet; user-event provides the clipboard.
    const { user } = setup();
    await quantitiesFor4x260SveziIstiDan(user);
    await user.click(screen.getByRole('button', { name: 'Podeli' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Količine su kopirane u klipbord');
    expect(await navigator.clipboard.readText()).toBe(sveziIstiDan4x260);
  });
});
