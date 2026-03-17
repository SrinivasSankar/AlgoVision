import { Panel } from '@/components/shared/Panel';
import { PathScore, Point } from '@/types';

interface AStarHeuristicsPanelProps {
  algorithm: string;
  selected?: Point;
  scores: Record<string, PathScore>;
}

export const AStarHeuristicsPanel = ({
  algorithm,
  selected,
  scores,
}: AStarHeuristicsPanelProps) => {
  if (algorithm !== 'astar') {
    return null;
  }

  const key = selected ? `${selected.row}:${selected.col}` : '';
  const score = key ? scores[key] : undefined;

  return (
    <Panel
      title="Animated Heuristics"
      subtitle="A* chooses the frontier node with the lowest f(n) = g(n) + h(n). The key below shows the active node's scores."
    >
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-ink">Selected Node</div>
          <div className="mt-2 text-2xl font-semibold text-ink">
            {selected ? `${selected.row},${selected.col}` : '-'}
          </div>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accentWarm" />
            <div className="text-xs uppercase tracking-[0.18em] text-ink">g(n)</div>
          </div>
          <div className="text-xs text-ink/80">Travel cost from the start.</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{score ? score.g : '-'}</div>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent" />
            <div className="text-xs uppercase tracking-[0.18em] text-ink">h(n)</div>
          </div>
          <div className="text-xs text-ink/80">Heuristic distance to the target.</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{score ? score.h : '-'}</div>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-success" />
            <div className="text-xs uppercase tracking-[0.18em] text-ink">f(n)</div>
          </div>
          <div className="text-xs text-ink/80">Priority score used for selection.</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{score ? score.f : '-'}</div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-ink">Node Color Key</div>
          <div className="space-y-2 text-sm text-ink">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accentWarm" />
              <span>Selected for expansion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" />
              <span>Frontier candidate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success" />
              <span>Already visited</span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};
