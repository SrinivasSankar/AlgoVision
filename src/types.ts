export type SimulatorTab =
  | 'sorting'
  | 'comparison'
  | 'pathfinding'
  | 'graph'
  | 'tree'
  | 'search';

export type SortingAlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick';

export type SortingStepType =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'markSorted'
  | 'setPivot'
  | 'message';

export interface SortingStep {
  type: SortingStepType;
  array: number[];
  activeIndices?: number[];
  sortedIndices?: number[];
  pivotIndex?: number;
  message: string;
  line: number;
  comparisonsDelta?: number;
  swapsDelta?: number;
}

export interface SortingResult {
  steps: SortingStep[];
  sortedArray: number[];
}

export interface SortingAlgorithmDefinition {
  id: SortingAlgorithmId;
  label: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export type PathAlgorithmId = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export type CellState =
  | 'empty'
  | 'wall'
  | 'start'
  | 'target'
  | 'frontier'
  | 'visited'
  | 'path';

export interface GridNode {
  row: number;
  col: number;
  state: CellState;
  distance: number;
}

export interface Point {
  row: number;
  col: number;
}

export interface PathScore {
  g: number;
  h: number;
  f: number;
}

export type PathStepType =
  | 'enqueue'
  | 'visitNode'
  | 'updateDistance'
  | 'reconstructPath'
  | 'message';

export interface PathStep {
  type: PathStepType;
  point?: Point;
  frontier?: Point[];
  visited?: Point[];
  path?: Point[];
  scores?: Record<string, PathScore>;
  selected?: Point;
  message: string;
  line: number;
}

export interface PathAlgorithmDefinition {
  id: PathAlgorithmId;
  label: string;
  description: string;
  weighted: boolean;
}

export type GraphAlgorithmId = 'bfs' | 'dfs';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export type GraphStepType = 'enqueue' | 'visit' | 'complete' | 'message';

export interface GraphStep {
  type: GraphStepType;
  activeNode?: string;
  frontier?: string[];
  visited?: string[];
  message: string;
  line: number;
}

export interface GraphAlgorithmDefinition {
  id: GraphAlgorithmId;
  label: string;
  description: string;
}

export type TreeAlgorithmId = 'preorder' | 'inorder' | 'postorder' | 'levelorder';

export interface TreeNodeData {
  id: string;
  value: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
}

export type TreeStepType = 'visit' | 'queue' | 'message';

export interface TreeStep {
  type: TreeStepType;
  activeNode?: string;
  visited?: string[];
  frontier?: string[];
  message: string;
  line: number;
}

export interface TreeAlgorithmDefinition {
  id: TreeAlgorithmId;
  label: string;
  description: string;
}

export type SearchAlgorithmId = 'linear' | 'binary';

export type SearchStepType = 'inspect' | 'narrow' | 'found' | 'message';

export interface SearchStep {
  type: SearchStepType;
  activeIndices?: number[];
  eliminatedIndices?: number[];
  foundIndex?: number;
  leftBound?: number;
  rightBound?: number;
  message: string;
  line: number;
}

export interface SearchAlgorithmDefinition {
  id: SearchAlgorithmId;
  label: string;
  description: string;
  bestFor: string;
}
