import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { Limit } from '../dough/dough';
import { parseDecimal } from '../format';
import { strings } from '../strings';

interface StepperProps {
  id: string;
  label: string;
  value: number;
  limit: Limit;
  /** The value with its unit, as shown in the field ("280 g", "0,1%"). */
  format: (value: number) => string;
  /** The value without its unit, for editing ("280", "0,1"). */
  formatEditable: (value: number) => string;
  onChange: (value: number) => void;
  decrementLabel: string;
  incrementLabel: string;
  inputMode: 'numeric' | 'decimal';
  hint?: ReactNode;
}

export function Stepper({
  id,
  label,
  value,
  limit,
  format,
  formatEditable,
  onChange,
  decrementLabel,
  incrementLabel,
  inputMode,
  hint,
}: StepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editing = draft !== null;

  // Select the whole value when editing starts, so typing replaces it.
  useLayoutEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);
  const atMin = value <= limit.min;
  const atMax = value >= limit.max;

  const commit = () => {
    if (draft === null) return;
    const parsed = parseDecimal(draft);
    if (parsed !== null) onChange(parsed);
    setDraft(null);
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__button"
          aria-label={decrementLabel}
          disabled={atMin}
          onClick={() => onChange(value - limit.step)}
        >
          −
        </button>
        <input
          id={id}
          className="stepper__input"
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          value={draft ?? format(value)}
          ref={inputRef}
          onFocus={() => setDraft(formatEditable(value))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
        />
        <button
          type="button"
          className="stepper__button"
          aria-label={incrementLabel}
          disabled={atMax}
          onClick={() => onChange(value + limit.step)}
        >
          +
        </button>
      </div>
      {hint}
      {(atMin || atMax) && (
        <span className="field__caption">
          {atMin ? strings.atMinimum(format(limit.min)) : strings.atMaximum(format(limit.max))}
        </span>
      )}
    </div>
  );
}
