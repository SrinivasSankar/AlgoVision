import { useEffect, useMemo, useState } from 'react';
import { getPathfindingSteps } from '@/algorithms/pathfinding';
import { pathAlgorithms, pathPseudocode } from '@/data/algorithms';
import { PathAlgorithmId, PathStep, Point } from '@/types';
import {
  createGrid,
  generateRandomWalls,
  GRID_COLS,
  GRID_ROWS,
  isSamePoint,
  pointKey,
} from '@/utils/grid';

const DEFAULT_START = { row: 5, col: 6 };
const DEFAULT_TARGET = { row: 12, col: 24 };

export const usePathfindingSimulation = () => {
  const [algorithm, setAlgorithm] = useState<PathAlgorithmId>('bfs');
  const [speed, setSpeed] = useState(22);
  const [start, setStart] = useState<Point>(DEFAULT_START);
  const [target, setTarget] = useState<Point>(DEFAULT_TARGET);
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [frontier, setFrontier] = useState<Point[]>([]);
  const [visited, setVisited] = useState<Point[]>([]);
  const [path, setPath] = useState<Point[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [scores, setScores] = useState<Record<string, { g: number; h: number; f: number }>>({});
  const [selected, setSelected] = useState<Point | undefined>();
  const [explanation, setExplanation] = useState(
    'Build a grid, place walls, and run a pathfinding algorithm to inspect every step.',
  );

  const algorithmMeta = useMemo(
    () => pathAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  const resetPlayback = () => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setFrontier([]);
    setVisited([]);
    setPath([]);
    setCurrentLine(0);
    setScores({});
    setSelected(undefined);
    setExplanation('Build a grid, place walls, and run a pathfinding algorithm to inspect every step.');
  };

  const applyStep = (step: PathStep) => {
    setFrontier(step.frontier ?? []);
    if (step.visited) {
      setVisited(step.visited);
    }
    if (step.path) {
      setPath(step.path);
    }
    setScores(step.scores ?? {});
    setSelected(step.selected);
    setCurrentLine(step.line);
    setExplanation(step.message);
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    if (stepIndex >= steps.length) {
      setIsRunning(false);
      return;
    }
    const timer = window.setTimeout(() => {
      applyStep(steps[stepIndex]);
      setStepIndex((current) => current + 1);
    }, speed);
    return () => window.clearTimeout(timer);
  }, [isRunning, stepIndex, steps, speed]);

  const grid = useMemo(() => {
    const board = createGrid(start, target, walls);
    const frontierSet = new Set(frontier.map(pointKey));
    const visitedSet = new Set(visited.map(pointKey));
    const pathSet = new Set(path.map(pointKey));

    return board.map((row) =>
      row.map((cell) => {
        const key = pointKey(cell);
        if (cell.state === 'start' || cell.state === 'target' || cell.state === 'wall') {
          return cell;
        }
        if (pathSet.has(key)) {
          return { ...cell, state: 'path' as const };
        }
        if (frontierSet.has(key)) {
          return { ...cell, state: 'frontier' as const };
        }
        if (visitedSet.has(key)) {
          return { ...cell, state: 'visited' as const };
        }
        return cell;
      }),
    );
  }, [start, target, walls, frontier, visited, path]);

  const startSimulation = () => {
    const nextSteps = getPathfindingSteps(algorithm, start, target, walls);
    resetPlayback();
    setSteps(nextSteps);
    setIsRunning(nextSteps.length > 0);
  };

  const pause = () => setIsRunning(false);

  const resume = () => {
    if (stepIndex < steps.length) {
      setIsRunning(true);
    }
  };

  const stepForward = () => {
    const nextSteps = steps.length > 0 ? steps : getPathfindingSteps(algorithm, start, target, walls);
    if (steps.length === 0) {
      setSteps(nextSteps);
    }
    if (stepIndex >= nextSteps.length) {
      return;
    }
    applyStep(nextSteps[stepIndex]);
    setStepIndex((current) => current + 1);
  };

  const toggleWall = (point: Point) => {
    if (isSamePoint(point, start) || isSamePoint(point, target)) {
      return;
    }
    setWalls((current) => {
      const next = new Set(current);
      const key = pointKey(point);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearBoard = () => setWalls(new Set());
  const randomizeWalls = () => setWalls(generateRandomWalls(start, target));

  useEffect(() => {
    resetPlayback();
  }, [algorithm, start, target, walls]);

  const pseudocode = pathPseudocode[algorithm];

  return {
    algorithm,
    setAlgorithm,
    algorithmMeta,
    grid,
    startNode: start,
    targetNode: target,
    setStartNode: setStart,
    setTargetNode: setTarget,
    toggleWall,
    clearBoard,
    randomizeWalls,
    speed,
    setSpeed,
    currentLine,
    elapsedMs: stepIndex * speed,
    explanation,
    scores,
    selected,
    pseudocode,
    isRunning,
    hasStarted: stepIndex > 0,
    startSimulation,
    pause,
    resume,
    resetPlayback,
    stepForward,
    dimensions: { rows: GRID_ROWS, cols: GRID_COLS },
  };
};
