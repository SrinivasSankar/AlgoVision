import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Slider } from '@/components/shared/Slider';
import { SortingBars } from '@/components/sorting/SortingBars';
import { SortingStats } from '@/components/sorting/SortingStats';
import { useSortingRunner } from '@/hooks/useSortingRunner';
import { SortingAlgorithmId } from '@/types';
import { generateRandomArray } from '@/utils/array';
import { useEffect, useState } from 'react';
import { PlaybackControls } from '@/components/shared/PlaybackControls';

const DEFAULT_SIZE = 28;

export const SortingComparisonVisualizer = () => {
  const [leftAlgorithm, setLeftAlgorithm] = useState<SortingAlgorithmId>('bubble');
  const [rightAlgorithm, setRightAlgorithm] = useState<SortingAlgorithmId>('merge');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(140);
  const [baseArray, setBaseArray] = useState(() => generateRandomArray(DEFAULT_SIZE));

  useEffect(() => {
    setBaseArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const left = useSortingRunner({
    algorithm: leftAlgorithm,
    baseArray,
    speed,
    autoResetDependencies: [rightAlgorithm],
  });
  const right = useSortingRunner({
    algorithm: rightAlgorithm,
    baseArray,
    speed,
    autoResetDependencies: [leftAlgorithm],
  });

  const isRunning = left.isRunning || right.isRunning;
  const hasStarted = left.hasStarted || right.hasStarted;

  const start = () => {
    left.start();
    right.start();
  };

  const pause = () => {
    left.pause();
    right.pause();
  };

  const resume = () => {
    left.resume();
    right.resume();
  };

  const reset = () => {
    left.reset();
    right.reset();
  };

  const stepForward = () => {
    left.stepForward();
    right.stepForward();
  };

  const randomize = () => setBaseArray(generateRandomArray(arraySize));

  const selectorOptions = [
    { value: 'bubble' as const, label: 'Bubble' },
    { value: 'selection' as const, label: 'Selection' },
    { value: 'insertion' as const, label: 'Insertion' },
    { value: 'merge' as const, label: 'Merge' },
    { value: 'quick' as const, label: 'Quick' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <Panel
          title="Sorting Comparison"
          subtitle="Run two sorting algorithms side by side on the same random array."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {left.algorithmMeta.label}
                </h3>
                <span className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink">
                  {left.algorithmMeta.timeComplexity}
                </span>
              </div>
              <SortingBars
                values={left.displayArray}
                activeIndices={left.activeIndices}
                sortedIndices={left.sortedIndices}
                pivotIndex={left.pivotIndex}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {right.algorithmMeta.label}
                </h3>
                <span className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink">
                  {right.algorithmMeta.timeComplexity}
                </span>
              </div>
              <SortingBars
                values={right.displayArray}
                activeIndices={right.activeIndices}
                sortedIndices={right.sortedIndices}
                pivotIndex={right.pivotIndex}
              />
            </div>
          </div>
        </Panel>
        <Panel title="Comparison Controls" subtitle="Shared input, shared playback, separate algorithms.">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-ink">Left Algorithm</div>
              <SegmentedControl
                value={leftAlgorithm}
                onChange={setLeftAlgorithm}
                options={selectorOptions}
              />
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-ink">Right Algorithm</div>
              <SegmentedControl
                value={rightAlgorithm}
                onChange={setRightAlgorithm}
                options={selectorOptions}
              />
            </div>
            <PlaybackControls
              speed={speed}
              onSpeedChange={setSpeed}
              isRunning={isRunning}
              hasStarted={hasStarted}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onStepForward={stepForward}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Slider
                label="Array Size"
                value={arraySize}
                min={12}
                max={40}
                onChange={setArraySize}
                valueLabel={`${arraySize} bars`}
              />
              <button
                className="rounded-2xl border border-ink/10 bg-panelSoft/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-panelSoft"
                onClick={randomize}
                type="button"
              >
                Generate Shared Array
              </button>
            </div>
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SortingStats
          algorithm={left.algorithmMeta.label}
          comparisons={left.comparisons}
          swaps={left.swaps}
          timeComplexity={left.algorithmMeta.timeComplexity}
          spaceComplexity={left.algorithmMeta.spaceComplexity}
        />
        <SortingStats
          algorithm={right.algorithmMeta.label}
          comparisons={right.comparisons}
          swaps={right.swaps}
          timeComplexity={right.algorithmMeta.timeComplexity}
          spaceComplexity={right.algorithmMeta.spaceComplexity}
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="grid gap-6">
          <ExplanationPanel
            title={`${left.algorithmMeta.label} Explanation`}
            description="The left runner replays its own events on the shared input."
            explanation={left.explanation}
          />
          <PseudocodePanel lines={left.pseudocode} activeLine={left.currentLine} />
        </div>
        <div className="grid gap-6">
          <ExplanationPanel
            title={`${right.algorithmMeta.label} Explanation`}
            description="The right runner replays independently so differences stay visible."
            explanation={right.explanation}
          />
          <PseudocodePanel lines={right.pseudocode} activeLine={right.currentLine} />
        </div>
      </div>
    </div>
  );
};
