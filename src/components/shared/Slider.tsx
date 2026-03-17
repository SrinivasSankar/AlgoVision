interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  valueLabel?: string;
}

export const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  valueLabel,
}: SliderProps) => (
  <label className="block">
    <div className="mb-2 flex items-center justify-between text-sm">
      <span className="text-ink">{label}</span>
      <span className="font-medium text-ink">{valueLabel ?? value}</span>
    </div>
    <input
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-accent"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);
