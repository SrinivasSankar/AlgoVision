import { Button } from '@/components/shared/Button';
import { Panel } from '@/components/shared/Panel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Slider } from '@/components/shared/Slider';
import { SortingAlgorithmId } from '@/types';

interface SortingControlsProps {
  algorithm: SortingAlgorithmId;
  onAlgorithmChange: (value: SortingAlgorithmId) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  arraySize: number;
  onArraySizeChange: (value: number) => void;
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onRandomize: () => void;
}

export const SortingControls = ({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onRandomize,
}: SortingControlsProps) => (
  <Panel title="Controls" subtitle="Tune the playback and inspect each state change.">
    <div className="space-y-5">
      <SegmentedControl
        value={algorithm}
        onChange={onAlgorithmChange}
        options={[
          { value: 'bubble', label: 'Bubble' },
          { value: 'selection', label: 'Selection' },
          { value: 'insertion', label: 'Insertion' },
          { value: 'merge', label: 'Merge' },
          { value: 'quick', label: 'Quick' },
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider
          label="Speed"
          value={speed}
          min={30}
          max={280}
          step={10}
          onChange={onSpeedChange}
          valueLabel={`${speed} ms`}
        />
        <Slider
          label="Array Size"
          value={arraySize}
          min={12}
          max={25}
          onChange={onArraySizeChange}
          valueLabel={`${arraySize} bars`}
        />
      </div>
      <Button className="w-full" onClick={onRandomize}>
        Generate New Random Array
      </Button>
    </div>
  </Panel>
);
