import { ElapsedTimePanel } from '@/components/shared/ElapsedTimePanel';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { Panel } from '@/components/shared/Panel';
import { SortingBars } from '@/components/sorting/SortingBars';
import { SortingControls } from '@/components/sorting/SortingControls';
import { SortingStats } from '@/components/sorting/SortingStats';
import { useSortingSimulation } from '@/hooks/useSortingSimulation';

export const SortingVisualizer = () => {
  const simulator = useSortingSimulation();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Panel
          title="Sorting Visualizer"
          subtitle={simulator.algorithmMeta.description}
          className="overflow-hidden"
        >
          <SortingBars
            values={simulator.displayArray}
            activeIndices={simulator.activeIndices}
            sortedIndices={simulator.sortedIndices}
            pivotIndex={simulator.pivotIndex}
          />
        </Panel>
        <SortingControls
          algorithm={simulator.algorithm}
          onAlgorithmChange={simulator.setAlgorithm}
          speed={simulator.speed}
          onSpeedChange={simulator.setSpeed}
          arraySize={simulator.arraySize}
          onArraySizeChange={simulator.setArraySize}
          isRunning={simulator.isRunning}
          hasStarted={simulator.hasStarted}
          onStart={simulator.start}
          onPause={simulator.pause}
          onResume={simulator.resume}
          onReset={simulator.reset}
          onStepForward={simulator.stepForward}
          onRandomize={simulator.randomize}
        />
      </div>
      <SortingStats
        algorithm={simulator.algorithmMeta.label}
        comparisons={simulator.comparisons}
        swaps={simulator.swaps}
        timeComplexity={simulator.algorithmMeta.timeComplexity}
        spaceComplexity={simulator.algorithmMeta.spaceComplexity}
      />
      <ElapsedTimePanel elapsedMs={simulator.elapsedMs} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ExplanationPanel
          title="Step Explanation"
          description="Each replayed event includes a teaching-oriented note."
          explanation={simulator.explanation}
        />
        <PseudocodePanel lines={simulator.pseudocode} activeLine={simulator.currentLine} />
      </div>
    </div>
  );
};
