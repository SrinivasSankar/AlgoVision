import { PathAlgorithmId, PathStep, Point } from '@/types';
import { getNeighbors, manhattanDistance, pointKey } from '@/utils/grid';

interface Config {
  start: Point;
  target: Point;
  walls: Set<string>;
}

const reconstructPath = (cameFrom: Map<string, Point>, target: Point) => {
  const path: Point[] = [];
  let currentKey = pointKey(target);
  let current = target;

  while (cameFrom.has(currentKey)) {
    path.unshift(current);
    current = cameFrom.get(currentKey)!;
    currentKey = pointKey(current);
  }

  return path;
};

const scoreSnapshot = (
  frontier: Point[],
  distance: Map<string, number>,
  target: Point,
  includeVisited: Point[] = [],
) => {
  const points = [...frontier, ...includeVisited];
  const unique = new Map(points.map((point) => [pointKey(point), point]));
  return [...unique.values()].reduce<Record<string, { g: number; h: number; f: number }>>(
    (acc, point) => {
      const key = pointKey(point);
      const g = distance.get(key) ?? Infinity;
      const h = manhattanDistance(point, target);
      acc[key] = { g, h, f: g + h };
      return acc;
    },
    {},
  );
};

const generatePathSteps = (algorithm: PathAlgorithmId, config: Config): PathStep[] => {
  const { start, target, walls } = config;
  const startKey = pointKey(start);
  const targetKey = pointKey(target);
  const frontier: Point[] = [start];
  const frontierSet = new Set([startKey]);
  const visited = new Set<string>();
  const cameFrom = new Map<string, Point>();
  const distance = new Map<string, number>([[startKey, 0]]);
  const steps: PathStep[] = [
    {
      type: 'enqueue',
      point: start,
      frontier: [start],
      message: 'The algorithm starts by adding the start node to the frontier.',
      line: 1,
    },
  ];

  const score = (point: Point) => {
    const g = distance.get(pointKey(point)) ?? Infinity;
    if (algorithm === 'astar') {
      return g + manhattanDistance(point, target);
    }
    return g;
  };

  while (frontier.length > 0) {
    let currentIndex = 0;
    if (algorithm === 'dfs') {
      currentIndex = frontier.length - 1;
    } else if (algorithm === 'dijkstra' || algorithm === 'astar') {
      currentIndex = frontier.reduce((bestIndex, point, index, items) =>
        score(point) < score(items[bestIndex]) ? index : bestIndex,
      0);
    }

    const [current] = frontier.splice(currentIndex, 1);
    frontierSet.delete(pointKey(current));

    if (visited.has(pointKey(current))) {
      continue;
    }
    visited.add(pointKey(current));

    steps.push({
      type: 'visitNode',
      point: current,
      frontier: [...frontier],
      visited: [...visited].map((key) => {
        const [row, col] = key.split(':').map(Number);
        return { row, col };
      }),
      message:
        algorithm === 'astar'
          ? `A* selects ${current.row},${current.col} because it currently has the lowest f(n) = g(n) + h(n).`
          : algorithm === 'dfs'
          ? 'DFS visits the newest frontier node and dives deeper.'
          : 'The next frontier node is visited and expanded.',
      scores:
        algorithm === 'astar'
          ? scoreSnapshot(
              [...frontier],
              distance,
              target,
              [...visited].map((key) => {
                const [row, col] = key.split(':').map(Number);
                return { row, col };
              }),
            )
          : undefined,
      selected: algorithm === 'astar' ? current : undefined,
      line: 3,
    });

    if (pointKey(current) === targetKey) {
      const path = reconstructPath(cameFrom, target);
      steps.push({
        type: 'reconstructPath',
        path,
        message: 'The target was reached, so the shortest discovered path is reconstructed.',
        line: 5,
      });
      return steps;
    }

    for (const neighbor of getNeighbors(current)) {
      const key = pointKey(neighbor);
      if (walls.has(key) || visited.has(key)) {
        continue;
      }

      const tentativeDistance = (distance.get(pointKey(current)) ?? 0) + 1;
      const hasBetterDistance = tentativeDistance < (distance.get(key) ?? Infinity);
      const shouldRecordParent =
        algorithm === 'bfs' || algorithm === 'dfs' || hasBetterDistance;

      if (shouldRecordParent) {
        cameFrom.set(key, current);
        distance.set(key, tentativeDistance);
      }

      if (!frontierSet.has(key)) {
        frontier.push(neighbor);
        frontierSet.add(key);
      }

      steps.push({
        type: algorithm === 'dijkstra' || algorithm === 'astar' ? 'updateDistance' : 'enqueue',
        point: neighbor,
        frontier: [...frontier],
        scores:
          algorithm === 'astar'
            ? scoreSnapshot([...frontier, neighbor], distance, target, [...visited].map((item) => {
                const [row, col] = item.split(':').map(Number);
                return { row, col };
              }))
            : undefined,
        selected: algorithm === 'astar' ? current : undefined,
        message:
          algorithm === 'astar'
            ? `A* scores neighbor ${neighbor.row},${neighbor.col} with g(n)=${tentativeDistance}, h(n)=${manhattanDistance(neighbor, target)}, and f(n)=${tentativeDistance + manhattanDistance(neighbor, target)}.`
            : algorithm === 'dijkstra'
              ? 'Dijkstra relaxes the edge and keeps the lowest known distance.'
              : 'An unvisited neighbor is added to the frontier.',
        line: 4,
      });
    }
  }

  steps.push({
    type: 'message',
    message: 'No path was found with the current wall layout.',
    line: 0,
  });
  return steps;
};

export const getPathfindingSteps = (
  algorithm: PathAlgorithmId,
  start: Point,
  target: Point,
  walls: Set<string>,
) => generatePathSteps(algorithm, { start, target, walls });
