import { ReactNode, useEffect, useState } from 'react';
import { ExplanationPanel } from '@/components/shared/ExplanationPanel';
import { Panel } from '@/components/shared/Panel';
import { PlaybackControls } from '@/components/shared/PlaybackControls';
import { PseudocodePanel } from '@/components/shared/PseudocodePanel';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Slider } from '@/components/shared/Slider';
import { PathfindingGrid } from '@/components/pathfinding/PathfindingGrid';
import { SortingBars } from '@/components/sorting/SortingBars';
import { SortingStats } from '@/components/sorting/SortingStats';
import { searchArray } from '@/data/structures';
import { useGraphRunner } from '@/hooks/useGraphRunner';
import { usePathfindingRunner } from '@/hooks/usePathfindingRunner';
import { useSearchRunner } from '@/hooks/useSearchRunner';
import { useSortingRunner } from '@/hooks/useSortingRunner';
import { useTreeRunner } from '@/hooks/useTreeRunner';
import {
  GraphAlgorithmId,
  PathAlgorithmId,
  SearchAlgorithmId,
  SortingAlgorithmId,
  TreeAlgorithmId,
} from '@/types';
import { generateRandomArray } from '@/utils/array';
import { generateRandomWalls } from '@/utils/grid';

type ComparisonMode = 'sorting' | 'pathfinding' | 'graph' | 'tree' | 'search';

const DEFAULT_SIZE = 25;
const sharedStart = { row: 5, col: 6 };
const sharedTarget = { row: 12, col: 24 };

const formatMs = (value: number) => `${(value / 1000).toFixed(2)}s`;

const algorithmOptions = {
  sorting: [
    { value: 'bubble' as const, label: 'Bubble' },
    { value: 'selection' as const, label: 'Selection' },
    { value: 'insertion' as const, label: 'Insertion' },
    { value: 'merge' as const, label: 'Merge' },
    { value: 'quick' as const, label: 'Quick' },
  ],
  pathfinding: [
    { value: 'bfs' as const, label: 'BFS' },
    { value: 'dfs' as const, label: 'DFS' },
    { value: 'dijkstra' as const, label: 'Dijkstra' },
    { value: 'astar' as const, label: 'A*' },
  ],
  graph: [
    { value: 'bfs' as const, label: 'BFS' },
    { value: 'dfs' as const, label: 'DFS' },
  ],
  tree: [
    { value: 'preorder' as const, label: 'Preorder' },
    { value: 'inorder' as const, label: 'Inorder' },
    { value: 'postorder' as const, label: 'Postorder' },
    { value: 'levelorder' as const, label: 'Level' },
  ],
  search: [
    { value: 'linear' as const, label: 'Linear' },
    { value: 'binary' as const, label: 'Binary' },
  ],
};

const GraphCanvas = ({ runner }: { runner: ReturnType<typeof useGraphRunner> }) => {
  const nodeMap = new Map(runner.nodes.map((node) => [node.id, node]));
  return (
    <svg viewBox="0 0 620 320" className="h-[320px] w-full min-w-[620px]">
      {runner.edges.map((edge) => {
        const from = nodeMap.get(edge.from)!;
        const to = nodeMap.get(edge.to)!;
        return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgb(var(--color-muted) / 0.45)" strokeWidth="3" />;
      })}
      {runner.nodes.map((node) => {
        const isActive = runner.activeNode === node.id;
        const isVisited = runner.visited.includes(node.id);
        const isFrontier = runner.frontier.includes(node.id);
        const fill = isActive ? 'rgb(var(--color-accent-warm))' : isVisited ? 'rgb(var(--color-success))' : isFrontier ? 'rgb(var(--color-accent))' : 'rgb(var(--color-panel))';
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="28" fill={fill} stroke="rgb(var(--color-ink) / 0.2)" strokeWidth="3" />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="rgb(var(--color-ink))">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const TreeCanvas = ({ runner }: { runner: ReturnType<typeof useTreeRunner> }) => {
  const nodeMap = new Map(runner.nodes.map((node) => [node.id, node]));
  return (
    <svg viewBox="0 0 640 340" className="h-[340px] w-full min-w-[640px]">
      {runner.nodes.flatMap((node) => {
        const links = [node.left, node.right].filter(Boolean) as string[];
        return links.map((childId) => {
          const child = nodeMap.get(childId)!;
          return <line key={`${node.id}-${childId}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="rgb(var(--color-muted) / 0.45)" strokeWidth="3" />;
        });
      })}
      {runner.nodes.map((node) => {
        const isActive = runner.activeNode === node.id;
        const isVisited = runner.visited.includes(node.id);
        const fill = isActive ? 'rgb(var(--color-accent-warm))' : isVisited ? 'rgb(var(--color-success))' : 'rgb(var(--color-panel))';
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="28" fill={fill} stroke="rgb(var(--color-ink) / 0.2)" strokeWidth="3" />
            <text x={node.x} y={node.y + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill="rgb(var(--color-ink))">
              {node.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SearchArrayView = ({ runner }: { runner: ReturnType<typeof useSearchRunner> }) => (
  <div className="rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4">
    <div className="mb-4 flex flex-wrap gap-3 text-sm text-ink">
      <span className="rounded-full border border-ink/10 px-3 py-1">Target: {runner.target}</span>
      {runner.bounds.left !== undefined && runner.bounds.right !== undefined && (
        <span className="rounded-full border border-ink/10 px-3 py-1">
          Bounds: {runner.bounds.left} to {runner.bounds.right}
        </span>
      )}
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {runner.array.map((value, index) => {
        const isActive = runner.activeIndices.includes(index);
        const isFound = runner.foundIndex === index;
        const isEliminated = runner.eliminatedIndices.includes(index);
        return (
          <div key={value} className={`rounded-2xl border p-4 text-center transition ${isFound ? 'border-success bg-success/20' : isActive ? 'border-accentWarm bg-accentWarm/20' : isEliminated ? 'border-ink/10 bg-panel opacity-45' : 'border-ink/10 bg-panelSoft/70'}`}>
            <div className="text-xs text-ink">Index {index}</div>
            <div className="mt-2 text-2xl font-bold text-ink">{value}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const TimingPanel = ({
  leftLabel,
  leftMs,
  rightLabel,
  rightMs,
}: {
  leftLabel: string;
  leftMs: number;
  rightLabel: string;
  rightMs: number;
}) => (
  <Panel
    title="Timing Difference"
    subtitle="Replay time is derived from the number of executed steps at the current playback speed."
  >
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-ink">{leftLabel}</div>
        <div className="mt-2 text-2xl font-semibold text-ink">{formatMs(leftMs)}</div>
      </div>
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-ink">Difference</div>
        <div className="mt-2 text-2xl font-semibold text-ink">{formatMs(Math.abs(leftMs - rightMs))}</div>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-panelSoft/70 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-ink">{rightLabel}</div>
        <div className="mt-2 text-2xl font-semibold text-ink">{formatMs(rightMs)}</div>
      </div>
    </div>
  </Panel>
);

export const ComparisonLab = () => {
  const [mode, setMode] = useState<ComparisonMode>('sorting');
  const [speed, setSpeed] = useState(180);

  const [sortLeft, setSortLeft] = useState<SortingAlgorithmId>('bubble');
  const [sortRight, setSortRight] = useState<SortingAlgorithmId>('merge');
  const [sortSize, setSortSize] = useState(DEFAULT_SIZE);
  const [sortArray, setSortArray] = useState(() => generateRandomArray(DEFAULT_SIZE));
  useEffect(() => setSortArray(generateRandomArray(sortSize)), [sortSize]);
  const sortingLeft = useSortingRunner({ algorithm: sortLeft, baseArray: sortArray, speed, autoResetDependencies: [sortRight] });
  const sortingRight = useSortingRunner({ algorithm: sortRight, baseArray: sortArray, speed, autoResetDependencies: [sortLeft] });

  const [pathLeft, setPathLeft] = useState<PathAlgorithmId>('bfs');
  const [pathRight, setPathRight] = useState<PathAlgorithmId>('astar');
  const [walls, setWalls] = useState(() => generateRandomWalls(sharedStart, sharedTarget, 0.18));
  const pathfindingLeft = usePathfindingRunner({ algorithm: pathLeft, start: sharedStart, target: sharedTarget, walls, speed, autoResetDependencies: [pathRight] });
  const pathfindingRight = usePathfindingRunner({ algorithm: pathRight, start: sharedStart, target: sharedTarget, walls, speed, autoResetDependencies: [pathLeft] });

  const [graphLeft, setGraphLeft] = useState<GraphAlgorithmId>('bfs');
  const [graphRight, setGraphRight] = useState<GraphAlgorithmId>('dfs');
  const graphRunnerLeft = useGraphRunner(graphLeft, speed, [graphRight]);
  const graphRunnerRight = useGraphRunner(graphRight, speed, [graphLeft]);

  const [treeLeft, setTreeLeft] = useState<TreeAlgorithmId>('inorder');
  const [treeRight, setTreeRight] = useState<TreeAlgorithmId>('levelorder');
  const treeRunnerLeft = useTreeRunner(treeLeft, speed, [treeRight]);
  const treeRunnerRight = useTreeRunner(treeRight, speed, [treeLeft]);

  const [searchLeft, setSearchLeft] = useState<SearchAlgorithmId>('linear');
  const [searchRight, setSearchRight] = useState<SearchAlgorithmId>('binary');
  const [target, setTarget] = useState(31);
  const searchRunnerLeft = useSearchRunner(searchLeft, target, speed, [searchRight]);
  const searchRunnerRight = useSearchRunner(searchRight, target, speed, [searchLeft]);

  const controls = (
    isRunning: boolean,
    hasStarted: boolean,
    startRun: () => void,
    pause: () => void,
    resume: () => void,
    reset: () => void,
    stepForward: () => void,
    selectors: ReactNode,
  ) => (
    <Panel title="Comparison Controls" subtitle="Shared playback, shared input, independent algorithms.">
      <div className="space-y-5">
        {selectors}
        <PlaybackControls
          speed={speed}
          onSpeedChange={setSpeed}
          isRunning={isRunning}
          hasStarted={hasStarted}
          onStart={startRun}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          onStepForward={stepForward}
        />
      </div>
    </Panel>
  );

  const explanationGrid = (
    leftTitle: string,
    leftExplanation: string,
    leftPseudocode: string[],
    leftLine: number,
    rightTitle: string,
    rightExplanation: string,
    rightPseudocode: string[],
    rightLine: number,
  ) => (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="grid gap-6">
        <ExplanationPanel title={`${leftTitle} Explanation`} description="Current step for the left runner." explanation={leftExplanation} />
        <PseudocodePanel lines={leftPseudocode} activeLine={leftLine} />
      </div>
      <div className="grid gap-6">
        <ExplanationPanel title={`${rightTitle} Explanation`} description="Current step for the right runner." explanation={rightExplanation} />
        <PseudocodePanel lines={rightPseudocode} activeLine={rightLine} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Panel title="Comparison Lab" subtitle="Compare algorithms across sorting, pathfinding, graph traversal, tree traversal, and search.">
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[
            { value: 'sorting', label: 'Sorting' },
            { value: 'pathfinding', label: 'Pathfinding' },
            { value: 'graph', label: 'Graph' },
            { value: 'tree', label: 'Tree' },
            { value: 'search', label: 'Search' },
          ]}
        />
      </Panel>

      {mode === 'sorting' && (
        <>
          <Panel title="Side-by-Side Replay" subtitle="Both sorting algorithms receive the same array.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{sortingLeft.algorithmMeta.label}</h3>
                <SortingBars values={sortingLeft.displayArray} activeIndices={sortingLeft.activeIndices} sortedIndices={sortingLeft.sortedIndices} pivotIndex={sortingLeft.pivotIndex} />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{sortingRight.algorithmMeta.label}</h3>
                <SortingBars values={sortingRight.displayArray} activeIndices={sortingRight.activeIndices} sortedIndices={sortingRight.sortedIndices} pivotIndex={sortingRight.pivotIndex} />
              </div>
            </div>
          </Panel>
          {controls(
            sortingLeft.isRunning || sortingRight.isRunning,
            sortingLeft.hasStarted || sortingRight.hasStarted,
            () => {
              sortingLeft.start();
              sortingRight.start();
            },
            () => {
              sortingLeft.pause();
              sortingRight.pause();
            },
            () => {
              sortingLeft.resume();
              sortingRight.resume();
            },
            () => {
              sortingLeft.reset();
              sortingRight.reset();
            },
            () => {
              sortingLeft.stepForward();
              sortingRight.stepForward();
            },
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Left Algorithm</div>
                <SegmentedControl value={sortLeft} onChange={setSortLeft} options={algorithmOptions.sorting} />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Right Algorithm</div>
                <SegmentedControl value={sortRight} onChange={setSortRight} options={algorithmOptions.sorting} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Slider label="Array Size" value={sortSize} min={12} max={25} onChange={setSortSize} valueLabel={`${sortSize} bars`} />
                <button className="rounded-2xl border border-ink/10 bg-panelSoft/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-panelSoft" type="button" onClick={() => setSortArray(generateRandomArray(sortSize))}>
                  Generate Shared Array
                </button>
              </div>
            </div>,
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <SortingStats algorithm={sortingLeft.algorithmMeta.label} comparisons={sortingLeft.comparisons} swaps={sortingLeft.swaps} timeComplexity={sortingLeft.algorithmMeta.timeComplexity} spaceComplexity={sortingLeft.algorithmMeta.spaceComplexity} />
            <SortingStats algorithm={sortingRight.algorithmMeta.label} comparisons={sortingRight.comparisons} swaps={sortingRight.swaps} timeComplexity={sortingRight.algorithmMeta.timeComplexity} spaceComplexity={sortingRight.algorithmMeta.spaceComplexity} />
          </div>
          <TimingPanel
            leftLabel={sortingLeft.algorithmMeta.label}
            leftMs={sortingLeft.elapsedMs}
            rightLabel={sortingRight.algorithmMeta.label}
            rightMs={sortingRight.elapsedMs}
          />
          {explanationGrid(sortingLeft.algorithmMeta.label, sortingLeft.explanation, sortingLeft.pseudocode, sortingLeft.currentLine, sortingRight.algorithmMeta.label, sortingRight.explanation, sortingRight.pseudocode, sortingRight.currentLine)}
        </>
      )}

      {mode === 'pathfinding' && (
        <>
          <Panel title="Side-by-Side Replay" subtitle="Both pathfinding algorithms run on the same wall layout.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{pathfindingLeft.algorithmMeta.label}</h3>
                <PathfindingGrid grid={pathfindingLeft.grid} startNode={sharedStart} targetNode={sharedTarget} disabled={true} scores={pathfindingLeft.scores} selected={pathfindingLeft.selected} onToggleWall={() => {}} onMoveStart={() => {}} onMoveTarget={() => {}} />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{pathfindingRight.algorithmMeta.label}</h3>
                <PathfindingGrid grid={pathfindingRight.grid} startNode={sharedStart} targetNode={sharedTarget} disabled={true} scores={pathfindingRight.scores} selected={pathfindingRight.selected} onToggleWall={() => {}} onMoveStart={() => {}} onMoveTarget={() => {}} />
              </div>
            </div>
          </Panel>
          {controls(
            pathfindingLeft.isRunning || pathfindingRight.isRunning,
            pathfindingLeft.hasStarted || pathfindingRight.hasStarted,
            () => {
              pathfindingLeft.startRun();
              pathfindingRight.startRun();
            },
            () => {
              pathfindingLeft.pause();
              pathfindingRight.pause();
            },
            () => {
              pathfindingLeft.resume();
              pathfindingRight.resume();
            },
            () => {
              pathfindingLeft.reset();
              pathfindingRight.reset();
            },
            () => {
              pathfindingLeft.stepForward();
              pathfindingRight.stepForward();
            },
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Left Algorithm</div>
                <SegmentedControl value={pathLeft} onChange={setPathLeft} options={algorithmOptions.pathfinding} />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Right Algorithm</div>
                <SegmentedControl value={pathRight} onChange={setPathRight} options={algorithmOptions.pathfinding} />
              </div>
              <button className="rounded-2xl border border-ink/10 bg-panelSoft/80 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-panelSoft" type="button" onClick={() => setWalls(generateRandomWalls(sharedStart, sharedTarget, 0.18))}>
                Generate Shared Obstacles
              </button>
            </div>,
          )}
          <TimingPanel
            leftLabel={pathfindingLeft.algorithmMeta.label}
            leftMs={pathfindingLeft.elapsedMs}
            rightLabel={pathfindingRight.algorithmMeta.label}
            rightMs={pathfindingRight.elapsedMs}
          />
          {explanationGrid(pathfindingLeft.algorithmMeta.label, pathfindingLeft.explanation, pathfindingLeft.pseudocode, pathfindingLeft.currentLine, pathfindingRight.algorithmMeta.label, pathfindingRight.explanation, pathfindingRight.pseudocode, pathfindingRight.currentLine)}
        </>
      )}

      {mode === 'graph' && (
        <>
          <Panel title="Side-by-Side Replay" subtitle="Both traversals use the same graph.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{graphRunnerLeft.algorithmMeta.label}</h3>
                <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4"><GraphCanvas runner={graphRunnerLeft} /></div>
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{graphRunnerRight.algorithmMeta.label}</h3>
                <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4"><GraphCanvas runner={graphRunnerRight} /></div>
              </div>
            </div>
          </Panel>
          {controls(
            graphRunnerLeft.isRunning || graphRunnerRight.isRunning,
            graphRunnerLeft.hasStarted || graphRunnerRight.hasStarted,
            () => {
              graphRunnerLeft.startRun();
              graphRunnerRight.startRun();
            },
            () => {
              graphRunnerLeft.pause();
              graphRunnerRight.pause();
            },
            () => {
              graphRunnerLeft.resume();
              graphRunnerRight.resume();
            },
            () => {
              graphRunnerLeft.reset();
              graphRunnerRight.reset();
            },
            () => {
              graphRunnerLeft.stepForward();
              graphRunnerRight.stepForward();
            },
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Left Algorithm</div>
                <SegmentedControl value={graphLeft} onChange={setGraphLeft} options={algorithmOptions.graph} />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Right Algorithm</div>
                <SegmentedControl value={graphRight} onChange={setGraphRight} options={algorithmOptions.graph} />
              </div>
            </div>,
          )}
          <TimingPanel
            leftLabel={graphRunnerLeft.algorithmMeta.label}
            leftMs={graphRunnerLeft.elapsedMs}
            rightLabel={graphRunnerRight.algorithmMeta.label}
            rightMs={graphRunnerRight.elapsedMs}
          />
          {explanationGrid(graphRunnerLeft.algorithmMeta.label, graphRunnerLeft.explanation, graphRunnerLeft.pseudocode, graphRunnerLeft.currentLine, graphRunnerRight.algorithmMeta.label, graphRunnerRight.explanation, graphRunnerRight.pseudocode, graphRunnerRight.currentLine)}
        </>
      )}

      {mode === 'tree' && (
        <>
          <Panel title="Side-by-Side Replay" subtitle="Both traversals use the same tree.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{treeRunnerLeft.algorithmMeta.label}</h3>
                <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4"><TreeCanvas runner={treeRunnerLeft} /></div>
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{treeRunnerRight.algorithmMeta.label}</h3>
                <div className="overflow-x-auto rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4"><TreeCanvas runner={treeRunnerRight} /></div>
              </div>
            </div>
          </Panel>
          {controls(
            treeRunnerLeft.isRunning || treeRunnerRight.isRunning,
            treeRunnerLeft.hasStarted || treeRunnerRight.hasStarted,
            () => {
              treeRunnerLeft.startRun();
              treeRunnerRight.startRun();
            },
            () => {
              treeRunnerLeft.pause();
              treeRunnerRight.pause();
            },
            () => {
              treeRunnerLeft.resume();
              treeRunnerRight.resume();
            },
            () => {
              treeRunnerLeft.reset();
              treeRunnerRight.reset();
            },
            () => {
              treeRunnerLeft.stepForward();
              treeRunnerRight.stepForward();
            },
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Left Algorithm</div>
                <SegmentedControl value={treeLeft} onChange={setTreeLeft} options={algorithmOptions.tree} />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Right Algorithm</div>
                <SegmentedControl value={treeRight} onChange={setTreeRight} options={algorithmOptions.tree} />
              </div>
            </div>,
          )}
          <TimingPanel
            leftLabel={treeRunnerLeft.algorithmMeta.label}
            leftMs={treeRunnerLeft.elapsedMs}
            rightLabel={treeRunnerRight.algorithmMeta.label}
            rightMs={treeRunnerRight.elapsedMs}
          />
          {explanationGrid(treeRunnerLeft.algorithmMeta.label, treeRunnerLeft.explanation, treeRunnerLeft.pseudocode, treeRunnerLeft.currentLine, treeRunnerRight.algorithmMeta.label, treeRunnerRight.explanation, treeRunnerRight.pseudocode, treeRunnerRight.currentLine)}
        </>
      )}

      {mode === 'search' && (
        <>
          <Panel title="Side-by-Side Replay" subtitle="Both searches run on the same sorted array.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{searchRunnerLeft.algorithmMeta.label}</h3>
                <SearchArrayView runner={searchRunnerLeft} />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-ink">{searchRunnerRight.algorithmMeta.label}</h3>
                <SearchArrayView runner={searchRunnerRight} />
              </div>
            </div>
          </Panel>
          {controls(
            searchRunnerLeft.isRunning || searchRunnerRight.isRunning,
            searchRunnerLeft.hasStarted || searchRunnerRight.hasStarted,
            () => {
              searchRunnerLeft.startRun();
              searchRunnerRight.startRun();
            },
            () => {
              searchRunnerLeft.pause();
              searchRunnerRight.pause();
            },
            () => {
              searchRunnerLeft.resume();
              searchRunnerRight.resume();
            },
            () => {
              searchRunnerLeft.reset();
              searchRunnerRight.reset();
            },
            () => {
              searchRunnerLeft.stepForward();
              searchRunnerRight.stepForward();
            },
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Left Algorithm</div>
                <SegmentedControl value={searchLeft} onChange={setSearchLeft} options={algorithmOptions.search} />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-ink">Right Algorithm</div>
                <SegmentedControl value={searchRight} onChange={setSearchRight} options={algorithmOptions.search} />
              </div>
              <Slider label="Target Value" value={target} min={searchArray[0]} max={searchArray[searchArray.length - 1]} step={1} onChange={setTarget} valueLabel={`${target}`} />
            </div>,
          )}
          <TimingPanel
            leftLabel={searchRunnerLeft.algorithmMeta.label}
            leftMs={searchRunnerLeft.elapsedMs}
            rightLabel={searchRunnerRight.algorithmMeta.label}
            rightMs={searchRunnerRight.elapsedMs}
          />
          {explanationGrid(searchRunnerLeft.algorithmMeta.label, searchRunnerLeft.explanation, searchRunnerLeft.pseudocode, searchRunnerLeft.currentLine, searchRunnerRight.algorithmMeta.label, searchRunnerRight.explanation, searchRunnerRight.pseudocode, searchRunnerRight.currentLine)}
        </>
      )}
    </div>
  );
};
