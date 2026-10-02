import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import {
  BallsIcon,
  DoughBallIcon,
  DropIcon,
  HouseIcon,
  PencilIcon,
  ShakerIcon,
  ShareIcon,
  SnowflakeIcon,
  TimerIcon,
  WheatIcon,
  YeastIcon,
} from '../components/icons';
import { IngredientRow } from '../components/IngredientRow';
import { ListSectionHeader } from '../components/SectionHeader';
import { SummaryBar } from '../components/SummaryBar';
import { Toast } from '../components/Toast';
import { proofingTimeline, type DoughInputs } from '../dough/dough';
import { formatGrams } from '../format';
import { ingredientLines, shareText, totalDoughText } from '../shareText';
import { ballCountLabel, strings } from '../strings';

const ingredientIcons = {
  flour: <WheatIcon />,
  water: <DropIcon />,
  salt: <ShakerIcon />,
  yeast: <YeastIcon strokeWidth={1.8} />,
};

const TOAST_MS = 3000;

export function QuantitiesScreen({ inputs }: { inputs: DoughInputs }) {
  const timeline = proofingTimeline(inputs.proofingSchedule);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast === null) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const share = async () => {
    const text = shareText(inputs);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: strings.shareTitle, text });
      } catch {
        // Dismissing the share sheet is not an error worth reporting.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setToast(strings.copiedToClipboard);
    } catch {
      // No share sheet and no clipboard: nothing more we can do.
    }
  };

  return (
    <>
      <Header title={strings.quantitiesTitle} backHref="#/" />
      <SummaryBar
        items={[
          { icon: <TimerIcon size={19} />, text: strings.summaryProofing(timeline.totalHours) },
          { icon: <DoughBallIcon size={19} />, text: formatGrams(inputs.ballWeightGrams) },
          { icon: <BallsIcon size={19} />, text: ballCountLabel(inputs.ballCount) },
        ]}
      />
      <main className="screen quantities">
        <section className="list-section">
          <ListSectionHeader
            id="ingredientsTitle"
            action={
              <a className="text-action" href="#/">
                <PencilIcon size={18} />
                {strings.edit}
              </a>
            }
          >
            {strings.sectionIngredients}
          </ListSectionHeader>
          <div className="list-card">
            <ul className="plain-list" aria-labelledby="ingredientsTitle">
              {ingredientLines(inputs).map(({ key, name, amount, percent }) => (
                <IngredientRow
                  key={key}
                  icon={ingredientIcons[key]}
                  name={name}
                  note={key === 'flour' ? strings.flourNote : undefined}
                  amount={amount}
                  percent={percent}
                />
              ))}
            </ul>
            <div className="total-row">
              <span>{strings.totalDough}</span>
              <strong>{totalDoughText(inputs)}</strong>
            </div>
          </div>
        </section>

        <section className="list-section">
          <ListSectionHeader id="timelineTitle">{strings.sectionProofing}</ListSectionHeader>
          <ol className="plain-list list-card" aria-labelledby="timelineTitle">
            {timeline.coldHours > 0 && (
              <li className="timeline-row">
                <SnowflakeIcon size={22} className="timeline-row__icon--cold" />
                <span>{strings.coldProof(timeline.coldHours)}</span>
              </li>
            )}
            <li className="timeline-row">
              <HouseIcon size={22} className="timeline-row__icon--warm" />
              <span>{strings.roomProof(timeline.roomHours, timeline.coldHours > 0)}</span>
            </li>
          </ol>
        </section>
      </main>
      {toast && <Toast message={toast} />}
      <div className="action-bar action-bar--split">
        <button type="button" className="button button--secondary" onClick={share}>
          <ShareIcon size={18} />
          {strings.share}
        </button>
        <a className="button button--primary" href="#/recept">
          {strings.viewRecipe}
        </a>
      </div>
    </>
  );
}
