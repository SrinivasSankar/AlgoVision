import { ElapsedTimePanel } from '@/components/shared/ElapsedTimePanel';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PlaybackControls } from '@/components/shared/PlaybackControls';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { useTreeSimulation } from '@/hooks/useTreeSimulation';

export const TreeVisualizer = () => {
  const simulator = useTreeSimulation();
  const nodeMap = new Map(simulator.nodes.map((node) => [node.id, node]));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Panel title="Tree Traversal" subtitle={simulator.algorithmMeta.description}>
          <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4">
            <svg viewBox="0 0 640 340" className="h-[340px] w-full min-w-[640px]">
              {simulator.nodes.flatMap((node) => {
                const links = [node.left, node.right].filter(Boolean) as string[];
                return links.map((childId) => {
                  const child = nodeMap.get(childId)!;
                  return (
                    <line
                      key={`${node.id}-${childId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={child.x}
                      y2={child.y}
                      stroke="rgb(var(--color-muted) / 0.45)"
                      strokeWidth="3"
                    />
                  );
                });
              })}
              {simulator.nodes.map((node) => {
                const isActive = simulator.activeNode === node.id;
                const isVisited = simulator.visited.includes(node.id);
                const fill = isActive
                  ? 'rgb(var(--color-accent-warm))'
                  : isVisited
                    ? 'rgb(var(--color-success))'
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
                      fontSize="16"
                      fontWeight="700"
                      fill="rgb(var(--color-ink))"
                    >
                      {node.value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Panel>
        <Panel title="Controls" subtitle="Replay different traversal orders on the same tree.">
          <div className="space-y-5">
            <SegmentedControl
              value={simulator.algorithm}
              onChange={simulator.setAlgorithm}
              options={[
                { value: 'preorder', label: 'Preorder' },
                { value: 'inorder', label: 'Inorder' },
                { value: 'postorder', label: 'Postorder' },
                { value: 'levelorder', label: 'Level' },
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
          description="The highlighted node shows the current visit in the traversal order."
          explanation={simulator.explanation}
        />
        <PseudocodePanel lines={simulator.pseudocode} activeLine={simulator.currentLine} />
      </div>
    </div>
  );
};
