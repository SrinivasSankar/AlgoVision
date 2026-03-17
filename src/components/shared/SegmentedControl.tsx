interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          className={`rounded-2xl border px-3 py-2 text-sm transition ${
            active
              ? 'border-accent bg-accent/15 text-ink'
              : 'border-ink/10 bg-panelSoft/70 text-ink hover:text-ink'
          }`}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
