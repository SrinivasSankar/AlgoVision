import { Button } from '@/components/shared/Button';
import { Slider } from '@/components/shared/Slider';

interface PlaybackControlsProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStepForward: () => void;
}

export const PlaybackControls = ({
  speed,
  onSpeedChange,
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
}: PlaybackControlsProps) => (
  <div className="space-y-5">
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
      min={120}
      max={700}
      step={20}
      onChange={onSpeedChange}
      valueLabel={`${speed} ms`}
    />
  </div>
);
