import { Button } from '@/components/shared/Button';
import { Panel } from '@/components/shared/Panel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Slider } from '@/components/shared/Slider';
import { PathAlgorithmId } from '@/types';

interface PathfindingControlsProps {
  algorithm: PathAlgorithmId;
  onAlgorithmChange: (value: PathAlgorithmId) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onClearBoard: () => void;
  onRandomizeWalls: () => void;
}

export const PathfindingControls = ({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onClearBoard,
  onRandomizeWalls,
}: PathfindingControlsProps) => (
  <Panel title="Pathfinding Controls" subtitle="Edit the board, then animate the search frontier.">
    <div className="space-y-5">
      <SegmentedControl
        value={algorithm}
        onChange={onAlgorithmChange}
        options={[
          { value: 'bfs', label: 'BFS' },
          { value: 'dfs', label: 'DFS' },
          { value: 'dijkstra', label: 'Dijkstra' },
          { value: 'astar', label: 'A*' },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="primary" onClick={onStart}>
          Start
        </Button>
        <Button onClick={isRunning ? onPause : onResume} disabled={!hasStarted}>
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
        <Button onClick={onReset}>Reset</Button>
        <Button onClick={onStepForward} disabled={isRunning}>
          Step Forward
        </Button>
      </div>
      <Slider
        label="Playback Speed"
        value={speed}
        min={10}
        max={80}
        step={2}
        onChange={onSpeedChange}
        valueLabel={`${speed} ms`}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={onClearBoard}>Clear Board</Button>
        <Button onClick={onRandomizeWalls}>Generate Obstacles</Button>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4 text-sm text-ink">
        Drag the green start node, drag the orange target, and draw walls by clicking empty cells.
      </div>
    </div>
  </Panel>
);
