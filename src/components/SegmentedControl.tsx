interface SegmentedControlProps<T extends string> {
  labelledBy: string;
  options: readonly T[];
  value: T;
  label: (option: T) => string;
  onChange: (option: T) => void;
}

export function SegmentedControl<T extends string>({ labelledBy, options, value, label, onChange }: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={options.length > 3 ? 'segmented segmented--compact' : 'segmented'}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="segmented__option"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {label(option)}
        </button>
      ))}
    </div>
  );
}
