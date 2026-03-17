interface SortingBarsProps {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
}

export const SortingBars = ({
  values,
  activeIndices,
  sortedIndices,
  pivotIndex,
}: SortingBarsProps) => (
  <div className="flex h-[360px] items-end gap-2 rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4">
    {values.map((value, index) => {
      const isActive = activeIndices.includes(index);
      const isSorted = sortedIndices.includes(index);
      const isPivot = pivotIndex === index;
      const background = isSorted
        ? 'linear-gradient(to top, rgb(var(--color-success)), rgb(var(--color-bar-sorted-end)))'
        : isPivot
          ? 'linear-gradient(to top, rgb(var(--color-accent-warm)), rgb(var(--color-bar-pivot-end)))'
          : isActive
            ? 'linear-gradient(to top, rgb(var(--color-danger)), rgb(var(--color-bar-active-end)))'
            : 'linear-gradient(to top, rgb(var(--color-accent)), rgb(var(--color-bar-default-end)))';

      return (
        <div key={`${index}-${value}`} className="flex flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[10px] text-ink">{value}</span>
          <div
            className="w-full rounded-t-2xl transition-all duration-150"
            style={{ height: `${value * 2.8}px`, background }}
          />
        </div>
      );
    })}
  </div>
);
