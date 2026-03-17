import { Panel } from '@/components/shared/Panel';

interface ElapsedTimePanelProps {
  elapsedMs: number;
  label?: string;
}

const formatMs = (value: number) => `${(value / 1000).toFixed(2)}s`;

export const ElapsedTimePanel = ({
  elapsedMs,
  label = 'Elapsed Replay Time',
}: ElapsedTimePanelProps) => (
  <Panel title="Timer" subtitle="Replay time based on executed steps and current playback speed.">
    <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-ink">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-ink">{formatMs(elapsedMs)}</div>
    </div>
  </Panel>
);
