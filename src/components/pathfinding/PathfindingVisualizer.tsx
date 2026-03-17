import { AStarHeuristicsPanel } from '@/components/pathfinding/AStarHeuristicsPanel';
import { ElapsedTimePanel } from '@/components/shared/ElapsedTimePanel';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { PathfindingControls } from '@/components/pathfinding/PathfindingControls';
import { PathfindingGrid } from '@/components/pathfinding/PathfindingGrid';
import { usePathfindingSimulation } from '@/hooks/usePathfindingSimulation';

export const PathfindingVisualizer = () => {
  const simulator = usePathfindingSimulation();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Panel title="Pathfinding Visualizer" subtitle={simulator.algorithmMeta.description}>
          <PathfindingGrid
            grid={simulator.grid}
            startNode={simulator.startNode}
            targetNode={simulator.targetNode}
            disabled={simulator.isRunning}
            scores={simulator.scores}
            selected={simulator.selected}
            onToggleWall={simulator.toggleWall}
            onMoveStart={simulator.setStartNode}
            onMoveTarget={simulator.setTargetNode}
          />
        </Panel>
        <PathfindingControls
          algorithm={simulator.algorithm}
          onAlgorithmChange={simulator.setAlgorithm}
          speed={simulator.speed}
          onSpeedChange={simulator.setSpeed}
          isRunning={simulator.isRunning}
          hasStarted={simulator.hasStarted}
          onStart={simulator.startSimulation}
          onPause={simulator.pause}
          onResume={simulator.resume}
          onReset={simulator.resetPlayback}
          onStepForward={simulator.stepForward}
          onClearBoard={simulator.clearBoard}
          onRandomizeWalls={simulator.randomizeWalls}
        />
      </div>
      <ElapsedTimePanel elapsedMs={simulator.elapsedMs} />
      <AStarHeuristicsPanel
        algorithm={simulator.algorithm}
        selected={simulator.selected}
        scores={simulator.scores}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExplanationPanel
          title="Algorithm Explanation"
          description="The panel updates as the frontier grows, settles nodes, and reconstructs the path."
          explanation={simulator.explanation}
        />
        <PseudocodePanel lines={simulator.pseudocode} activeLine={simulator.currentLine} />
      </div>
    </div>
  );
};
