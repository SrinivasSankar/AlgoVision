import { ElapsedTimePanel } from '@/components/shared/ElapsedTimePanel';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PlaybackControls } from '@/components/shared/PlaybackControls';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useGraphSimulation } from '@/hooks/useGraphSimulation';

export const GraphVisualizer = () => {
  const simulator = useGraphSimulation();
  const nodeMap = new Map(simulator.nodes.map((node) => [node.id, node]));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Panel title="Graph Traversal" subtitle={simulator.algorithmMeta.description}>
          <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4">
            <svg viewBox="0 0 620 320" className="h-[320px] w-full min-w-[620px]">
              {simulator.edges.map((edge) => {
                const from = nodeMap.get(edge.from)!;
                const to = nodeMap.get(edge.to)!;
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgb(var(--color-muted) / 0.45)"
                    strokeWidth="3"
                  />
                );
              })}
              {simulator.nodes.map((node) => {
                const isActive = simulator.activeNode === node.id;
                const isVisited = simulator.visited.includes(node.id);
                const isFrontier = simulator.frontier.includes(node.id);
                const fill = isActive
                  ? 'rgb(var(--color-accent-warm))'
                  : isVisited
                    ? 'rgb(var(--color-success))'
                    : isFrontier
                      ? 'rgb(var(--color-accent))'
                      : 'rgb(var(--color-panel))';
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill={fill}
                      stroke="rgb(var(--color-ink) / 0.2)"
                      strokeWidth="3"
                    />
                    <text
                      x={node.x}
                      y={node.y + 6}
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="700"
                      fill="rgb(var(--color-ink))"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Panel>
        <Panel title="Controls" subtitle="Inspect how the frontier evolves over the graph.">
          <div className="space-y-5">
            <SegmentedControl
              value={simulator.algorithm}
              onChange={simulator.setAlgorithm}
              options={[
                { value: 'bfs', label: 'BFS' },
                { value: 'dfs', label: 'DFS' },
              ]}
            />
            <PlaybackControls
              speed={simulator.speed}
              onSpeedChange={simulator.setSpeed}
              isRunning={simulator.isRunning}
              hasStarted={simulator.hasStarted}
              onStart={simulator.start}
              onPause={simulator.pause}
              onResume={simulator.resume}
              onReset={simulator.reset}
              onStepForward={simulator.stepForward}
            />
          </div>
        </Panel>
      </div>
      <ElapsedTimePanel elapsedMs={simulator.elapsedMs} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExplanationPanel
          title="Traversal Explanation"
          description="Each event explains how the frontier or visited set changes."
          explanation={simulator.explanation}
        />
        <PseudocodePanel lines={simulator.pseudocode} activeLine={simulator.currentLine} />
      </div>
    </div>
  );
};
