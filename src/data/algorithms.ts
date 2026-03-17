import {
  GraphAlgorithmDefinition,
  PathAlgorithmDefinition,
  SearchAlgorithmDefinition,
  SortingAlgorithmDefinition,
  TreeAlgorithmDefinition,
} from '@/types';

export const sortingAlgorithms: SortingAlgorithmDefinition[] = [
  {
    id: 'bubble',
    label: 'Bubble Sort',
    description: 'Repeatedly compares adjacent values and bubbles larger items to the end.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'selection',
    label: 'Selection Sort',
    description: 'Selects the smallest remaining value and places it in the next sorted position.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'insertion',
    label: 'Insertion Sort',
    description: 'Builds a sorted prefix by inserting each new item into its correct position.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
  },
  {
    id: 'merge',
    label: 'Merge Sort',
    description: 'Recursively splits the array, then merges sorted halves back together.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'quick',
    label: 'Quick Sort',
    description: 'Partitions the array around a pivot, then sorts each side recursively.',
    timeComplexity: 'O(n log n) avg',
    spaceComplexity: 'O(log n)',
  },
];

export const pathAlgorithms: PathAlgorithmDefinition[] = [
  {
    id: 'bfs',
    label: 'Breadth-First Search',
    description: 'Explores the grid layer by layer, guaranteeing the shortest path in unweighted graphs.',
    weighted: false,
  },
  {
    id: 'dfs',
    label: 'Depth-First Search',
    description: 'Explores one branch deeply before backtracking, useful for traversal but not shortest paths.',
    weighted: false,
  },
  {
    id: 'dijkstra',
    label: 'Dijkstra',
    description: 'Expands the lowest-cost frontier node first to find shortest paths in weighted graphs.',
    weighted: true,
  },
  {
    id: 'astar',
    label: 'A* Search',
    description: 'Uses actual cost plus heuristic distance to target for focused shortest-path search.',
    weighted: true,
  },
];

export const graphAlgorithms: GraphAlgorithmDefinition[] = [
  {
    id: 'bfs',
    label: 'Graph BFS',
    description: 'Explores neighbors level by level, producing a breadth-first traversal order.',
  },
  {
    id: 'dfs',
    label: 'Graph DFS',
    description: 'Dives down one branch before backtracking to the next unexplored branch.',
  },
];

export const treeAlgorithms: TreeAlgorithmDefinition[] = [
  {
    id: 'preorder',
    label: 'Preorder',
    description: 'Visit root, then left subtree, then right subtree.',
  },
  {
    id: 'inorder',
    label: 'Inorder',
    description: 'Visit left subtree, then root, then right subtree.',
  },
  {
    id: 'postorder',
    label: 'Postorder',
    description: 'Visit left subtree, then right subtree, then root.',
  },
  {
    id: 'levelorder',
    label: 'Level Order',
    description: 'Visit nodes level by level using a queue.',
  },
];

export const searchAlgorithms: SearchAlgorithmDefinition[] = [
  {
    id: 'linear',
    label: 'Linear Search',
    description: 'Scans values from left to right until the target is found.',
    bestFor: 'Small or unsorted arrays',
  },
  {
    id: 'binary',
    label: 'Binary Search',
    description: 'Checks the middle value and halves the search space each step.',
    bestFor: 'Sorted arrays',
  },
];

export const sortingPseudocode: Record<string, string[]> = {
  bubble: [
    'for end from n - 1 down to 1',
    '  for i from 0 to end - 1',
    '    compare array[i] and array[i + 1]',
    '    if array[i] > array[i + 1], swap them',
    '  mark position end as sorted',
  ],
  selection: [
    'for i from 0 to n - 1',
    '  minIndex = i',
    '  for j from i + 1 to n - 1',
    '    if array[j] < array[minIndex], update minIndex',
    '  swap array[i] with array[minIndex]',
  ],
  insertion: [
    'for i from 1 to n - 1',
    '  current = array[i]',
    '  j = i - 1',
    '  while j >= 0 and array[j] > current',
    '    shift array[j] right and decrement j',
    '  insert current at j + 1',
  ],
  merge: [
    'split the array until subarrays have one element',
    'merge left and right halves',
    'compare front elements from each half',
    'write the smaller value into the merged array',
    'copy any remaining values',
  ],
  quick: [
    'choose the last element as pivot',
    'partition elements into less-than and greater-than pivot',
    'swap smaller elements toward the left side',
    'place pivot into its final position',
    'recursively sort left and right partitions',
  ],
};

export const pathPseudocode: Record<string, string[]> = {
  bfs: [
    'enqueue the start node',
    'while the queue is not empty',
    '  dequeue the front node',
    '  visit each unvisited neighbor',
    '  enqueue neighbors and record parent',
  ],
  dfs: [
    'push the start node onto the stack',
    'while the stack is not empty',
    '  pop the top node',
    '  visit each unvisited neighbor',
    '  push neighbors and record parent',
  ],
  dijkstra: [
    'set all distances to infinity except start',
    'pick the frontier node with smallest distance',
    'relax each reachable neighbor',
    'update distance and parent when improved',
    'repeat until target is settled',
  ],
  astar: [
    'set start cost to 0 and estimate to target',
    'pick node with lowest f = g + h',
    'visit reachable neighbors',
    'update g score and parent if improved',
    'repeat until target is reached',
  ],
};

export const graphPseudocode: Record<string, string[]> = {
  bfs: [
    'enqueue the start node',
    'while the queue is not empty',
    '  dequeue the next node',
    '  visit each unvisited neighbor',
    '  enqueue unseen neighbors',
  ],
  dfs: [
    'push the start node onto the stack',
    'while the stack is not empty',
    '  pop the top node',
    '  visit each unvisited neighbor',
    '  push unseen neighbors',
  ],
};

export const treePseudocode: Record<string, string[]> = {
  preorder: [
    'visit the root',
    'traverse the left subtree',
    'traverse the right subtree',
  ],
  inorder: [
    'traverse the left subtree',
    'visit the root',
    'traverse the right subtree',
  ],
  postorder: [
    'traverse the left subtree',
    'traverse the right subtree',
    'visit the root',
  ],
  levelorder: [
    'enqueue the root',
    'while the queue is not empty',
    '  dequeue the front node',
    '  visit it and enqueue children',
  ],
};

export const searchPseudocode: Record<string, string[]> = {
  linear: [
    'for each index from left to right',
    '  compare the value with the target',
    '  if equal, return the index',
    'return not found',
  ],
  binary: [
    'set left = 0 and right = n - 1',
    'while left <= right',
    '  inspect the middle value',
    '  discard the half that cannot contain the target',
    'return not found if bounds cross',
  ],
};
