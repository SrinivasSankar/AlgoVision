import { ElapsedTimePanel } from '@/components/shared/ElapsedTimePanel';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PlaybackControls } from '@/components/shared/PlaybackControls';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Slider } from '@/components/shared/Slider';
import { useSearchSimulation } from '@/hooks/useSearchSimulation';

export const SearchVisualizer = () => {
  const simulator = useSearchSimulation();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Panel title="Search Visualizer" subtitle={simulator.algorithmMeta.description}>
          <div className="rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4">
            <div className="mb-4 flex flex-wrap gap-3 text-sm text-ink">
              <span className="rounded-full border border-ink/10 px-3 py-1">
                Target: {simulator.target}
              </span>
              <span className="rounded-full border border-ink/10 px-3 py-1">
                Best for: {simulator.algorithmMeta.bestFor}
              </span>
              {simulator.bounds.left !== undefined && simulator.bounds.right !== undefined && (
                <span className="rounded-full border border-ink/10 px-3 py-1">
                  Bounds: {simulator.bounds.left} to {simulator.bounds.right}
                </span>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {simulator.array.map((value, index) => {
                const isActive = simulator.activeIndices.includes(index);
                const isFound = simulator.foundIndex === index;
                const isEliminated = simulator.eliminatedIndices.includes(index);
                return (
                  <div
                    key={value}
                    className={`rounded-2xl border p-4 text-center transition ${
                      isFound
                        ? 'border-success bg-success/20'
                        : isActive
                          ? 'border-accentWarm bg-accentWarm/20'
                          : isEliminated
                            ? 'border-ink/10 bg-panel opacity-45'
                            : 'border-ink/10 bg-panelSoft/70'
                    }`}
                  >
                    <div className="text-xs text-ink">Index {index}</div>
                    <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
        <Panel title="Controls" subtitle="Compare sequential inspection with divide-and-conquer search.">
          <div className="space-y-5">
            <SegmentedControl
              value={simulator.algorithm}
              onChange={simulator.setAlgorithm}
              options={[
                { value: 'linear', label: 'Linear' },
                { value: 'binary', label: 'Binary' },
              ]}
            />
            <Slider
              label="Target Value"
              value={simulator.target}
              min={4}
              max={63}
              step={1}
              onChange={simulator.setTarget}
              valueLabel={`${simulator.target}`}
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
          title="Search Explanation"
          description="The current step explains which candidates are checked or eliminated."
          explanation={simulator.explanation}
        />
        <PseudocodePanel lines={simulator.pseudocode} activeLine={simulator.currentLine} />
      </div>
    </div>
  );
};
