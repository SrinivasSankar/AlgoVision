import { Panel } from '@/components/shared/Panel';

interface SortingStatsProps {
  algorithm: string;
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
}

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
    <div className="text-xs uppercase tracking-[0.2em] text-ink">{label}</div>
    <div className="mt-2 text-xl font-semibold text-ink">{value}</div>
  </div>
);

export const SortingStats = ({
  algorithm,
  comparisons,
  swaps,
  timeComplexity,
  spaceComplexity,
}: SortingStatsProps) => (
  <Panel title="Live Stats" subtitle="Metrics update as each event is replayed.">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Algorithm" value={algorithm} />
      <StatCard label="Comparisons" value={comparisons} />
      <StatCard label="Swaps / Writes" value={swaps} />
      <StatCard label="Time Complexity" value={timeComplexity} />
      <StatCard label="Space Complexity" value={spaceComplexity} />
    </div>
  </Panel>
);
