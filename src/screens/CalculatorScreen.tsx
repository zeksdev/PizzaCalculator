import { useState } from 'react';
import { Header } from '../components/Header';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, DoughIcon, InfoIcon, PercentIcon, ResetIcon, YeastIcon } from '../components/icons';
import { FormSectionHeader } from '../components/SectionHeader';
import { SegmentedControl } from '../components/SegmentedControl';
import { Stepper } from '../components/Stepper';
import { LIMITS, PROOFING_SCHEDULES, proofingTimeline, recommendedYeastPercent, YEAST_TYPES } from '../dough/dough';
import { formatGrams, formatPercent, formatPercentValue } from '../format';
import { strings } from '../strings';
import type { Calculator } from '../useCalculator';

const formatCount = (value: number) => String(value);

export function CalculatorScreen({ calculator, onCalculate }: { calculator: Calculator; onCalculate: () => void }) {
  const { inputs, setNumber, setYeastType, setProofingSchedule, resetToDefaults } = calculator;
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const timeline = proofingTimeline(inputs.proofingSchedule);

  return (
    <>
      <Header
        title={strings.appName}
        action={
          <button type="button" className="icon-button" aria-label={strings.resetDefaults} onClick={resetToDefaults}>
            <ResetIcon size={20} />
          </button>
        }
      />
      <main className="screen calculator">
        <section className="form-section">
          <FormSectionHeader icon={<DoughIcon size={22} />}>{strings.sectionDough}</FormSectionHeader>
          <Stepper
            id="ballCount"
            label={strings.ballCount}
            value={inputs.ballCount}
            limit={LIMITS.ballCount}
            format={formatCount}
            formatEditable={formatCount}
            onChange={(v) => setNumber('ballCount', v)}
            decrementLabel={strings.ballCountDecrement}
            incrementLabel={strings.ballCountIncrement}
            inputMode="numeric"
          />
          <Stepper
            id="ballWeight"
            label={strings.ballWeight}
            value={inputs.ballWeightGrams}
            limit={LIMITS.ballWeightGrams}
            format={formatGrams}
            formatEditable={formatCount}
            onChange={(v) => setNumber('ballWeightGrams', v)}
            decrementLabel={strings.ballWeightDecrement}
            incrementLabel={strings.ballWeightIncrement}
            inputMode="numeric"
          />
        </section>

        <section className="form-section">
          <FormSectionHeader id="yeastTypeLabel" icon={<YeastIcon size={22} />}>
            {strings.sectionYeastType}
          </FormSectionHeader>
          <SegmentedControl
            labelledBy="yeastTypeLabel"
            options={YEAST_TYPES}
            value={inputs.yeastType}
            label={strings.yeastTypeLabel}
            onChange={setYeastType}
          />
        </section>

        <section className="form-section">
          <FormSectionHeader id="proofingLabel" icon={<ClockIcon size={22} />}>
            {strings.sectionProofing}
          </FormSectionHeader>
          <SegmentedControl
            labelledBy="proofingLabel"
            options={PROOFING_SCHEDULES}
            value={inputs.proofingSchedule}
            label={strings.proofingScheduleLabel}
            onChange={setProofingSchedule}
          />
          <span className="caption">{strings.proofingCaption(timeline.coldHours, timeline.roomHours)}</span>
        </section>

        <button
          type="button"
          className="advanced-toggle"
          aria-expanded={advancedOpen}
          aria-controls="advancedSettings"
          onClick={() => setAdvancedOpen((open) => !open)}
        >
          <span className="advanced-toggle__text">
            <span className="advanced-toggle__title">{strings.advancedSettings}</span>
            {!advancedOpen && (
              <span className="advanced-toggle__summary">
                {strings.advancedSummary(inputs.yeastPercent, inputs.hydrationPercent, inputs.saltPercent)}
              </span>
            )}
          </span>
          {advancedOpen ? <ChevronUpIcon size={22} /> : <ChevronDownIcon size={22} />}
        </button>

        {advancedOpen && (
          <section className="form-section" id="advancedSettings">
            <FormSectionHeader icon={<PercentIcon size={22} />}>{strings.sectionPercentages}</FormSectionHeader>
            <Stepper
              id="yeastPercent"
              label={strings.yeastPercent}
              value={inputs.yeastPercent}
              limit={LIMITS.yeastPercent}
              format={formatPercent}
              formatEditable={formatPercentValue}
              onChange={(v) => setNumber('yeastPercent', v)}
              decrementLabel={strings.yeastPercentDecrement}
              incrementLabel={strings.yeastPercentIncrement}
              inputMode="decimal"
              hint={
                <span className="hint">
                  <InfoIcon size={16} />
                  <span>
                    {strings.yeastRecommendation(inputs.yeastType)}
                    <strong>{formatPercent(recommendedYeastPercent(inputs.proofingSchedule, inputs.yeastType))}</strong>
                  </span>
                </span>
              }
            />
            <Stepper
              id="hydrationPercent"
              label={strings.hydration}
              value={inputs.hydrationPercent}
              limit={LIMITS.hydrationPercent}
              format={formatPercent}
              formatEditable={formatPercentValue}
              onChange={(v) => setNumber('hydrationPercent', v)}
              decrementLabel={strings.hydrationDecrement}
              incrementLabel={strings.hydrationIncrement}
              inputMode="decimal"
            />
            <Stepper
              id="saltPercent"
              label={strings.salt}
              value={inputs.saltPercent}
              limit={LIMITS.saltPercent}
              format={formatPercent}
              formatEditable={formatPercentValue}
              onChange={(v) => setNumber('saltPercent', v)}
              decrementLabel={strings.saltDecrement}
              incrementLabel={strings.saltIncrement}
              inputMode="decimal"
            />
          </section>
        )}
      </main>
      <div className="action-bar">
        <button type="button" className="button button--primary" onClick={onCalculate}>
          {strings.calculate}
        </button>
      </div>
    </>
  );
}
