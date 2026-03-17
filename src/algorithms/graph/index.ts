import { graphEdges, graphNodes } from '@/data/structures';
import { GraphAlgorithmId, GraphStep } from '@/types';

const adjacency = graphNodes.reduce<Record<string, string[]>>((acc, node) => {
  acc[node.id] = [];
  return acc;
}, {});

for (const edge of graphEdges) {
  adjacency[edge.from].push(edge.to);
  adjacency[edge.to].push(edge.from);
}

export const getGraphSteps = (algorithm: GraphAlgorithmId, start = 'A'): GraphStep[] => {
  const frontier = [start];
  const visited = new Set<string>();
  const seen = new Set<string>([start]);
  const steps: GraphStep[] = [
    {
      type: 'enqueue',
      activeNode: start,
      frontier: [start],
      visited: [],
      message: 'The traversal begins by adding the start node to the frontier.',
      line: 1,
    },
  ];

  while (frontier.length > 0) {
    const current = algorithm === 'dfs' ? frontier.pop()! : frontier.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    steps.push({
      type: 'visit',
      activeNode: current,
      frontier: [...frontier],
      visited: [...visited],
      message:
        algorithm === 'dfs'
          ? `DFS visits ${current} by taking the most recently added branch.`
          : `BFS visits ${current} from the front of the queue.`,
      line: 3,
    });

    for (const neighbor of adjacency[current]) {
      if (seen.has(neighbor)) {
        continue;
      }
      seen.add(neighbor);
      frontier.push(neighbor);
      steps.push({
        type: 'enqueue',
        activeNode: neighbor,
        frontier: [...frontier],
        visited: [...visited],
        message: `${neighbor} is discovered from ${current} and added to the frontier.`,
        line: 4,
      });
    }
  }

  steps.push({
    type: 'complete',
    frontier: [],
    visited: [...visited],
    message: 'Traversal complete. Every reachable node has been visited.',
    line: 0,
  });

  return steps;
};
