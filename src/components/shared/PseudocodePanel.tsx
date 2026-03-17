import { Panel } from '@/components/shared/Panel';

interface PseudocodePanelProps {
  lines: string[];
  activeLine: number;
}

export const PseudocodePanel = ({ lines, activeLine }: PseudocodePanelProps) => (
  <Panel title="Pseudocode" subtitle="The highlighted line tracks the current algorithm step.">
    <div className="space-y-2 font-mono text-sm">
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const active = lineNumber === activeLine;
        return (
          <div
            key={line}
            className={`flex gap-3 rounded-2xl px-3 py-2 transition ${
              active ? 'bg-accent/15 text-ink ring-1 ring-accent/40' : 'text-ink'
            }`}
          >
            <span className="w-5 text-right text-xs text-ink">{lineNumber}</span>
            <span>{line}</span>
          </div>
        );
      })}
    </div>
  </Panel>
);
