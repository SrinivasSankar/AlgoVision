import { useEffect, useMemo, useState } from 'react';
import { getPathfindingSteps } from '@/algorithms/pathfinding';
import { pathAlgorithms, pathPseudocode } from '@/data/algorithms';
import { PathAlgorithmId, PathStep, Point } from '@/types';
import { createGrid, pointKey } from '@/utils/grid';

interface UsePathfindingRunnerOptions {
  algorithm: PathAlgorithmId;
  start: Point;
  target: Point;
  walls: Set<string>;
  speed: number;
  autoResetDependencies?: unknown[];
}

export const usePathfindingRunner = ({
  algorithm,
  start,
  target,
  walls,
  speed,
  autoResetDependencies = [],
}: UsePathfindingRunnerOptions) => {
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
    'Run the algorithm to compare how the frontier explores the same board.',
  );

  const algorithmMeta = useMemo(
    () => pathAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  const reset = () => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setFrontier([]);
    setVisited([]);
    setPath([]);
    setCurrentLine(0);
    setScores({});
    setSelected(undefined);
    setExplanation('Run the algorithm to compare how the frontier explores the same board.');
  };

  const applyStep = (step: PathStep) => {
    setFrontier(step.frontier ?? []);
    if (step.visited) setVisited(step.visited);
    if (step.path) setPath(step.path);
    setScores(step.scores ?? {});
    setSelected(step.selected);
    setCurrentLine(step.line);
    setExplanation(step.message);
  };

  useEffect(() => {
    if (!isRunning) return;
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

  useEffect(() => {
    reset();
  }, [algorithm, start, target, walls, ...autoResetDependencies]);

  const grid = useMemo(() => {
    const board = createGrid(start, target, walls);
    const frontierSet = new Set(frontier.map(pointKey));
    const visitedSet = new Set(visited.map(pointKey));
    const pathSet = new Set(path.map(pointKey));
    return board.map((row) =>
      row.map((cell) => {
        const key = pointKey(cell);
        if (cell.state === 'start' || cell.state === 'target' || cell.state === 'wall') return cell;
        if (pathSet.has(key)) return { ...cell, state: 'path' as const };
        if (frontierSet.has(key)) return { ...cell, state: 'frontier' as const };
        if (visitedSet.has(key)) return { ...cell, state: 'visited' as const };
        return cell;
      }),
    );
  }, [start, target, walls, frontier, visited, path]);

  const ensureSteps = () => {
    const next = getPathfindingSteps(algorithm, start, target, walls);
    setSteps(next);
    return next;
  };

  return {
    algorithmMeta,
    grid,
    explanation,
    currentLine,
    scores,
    selected,
    elapsedMs: stepIndex * speed,
    pseudocode: pathPseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    startRun: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setFrontier([]);
      setVisited([]);
      setPath([]);
      setCurrentLine(0);
      setExplanation('Run the algorithm to compare how the frontier explores the same board.');
      setIsRunning(next.length > 0);
    },
    pause: () => setIsRunning(false),
    resume: () => {
      if (stepIndex < steps.length) setIsRunning(true);
    },
    reset,
    stepForward: () => {
      const next = steps.length > 0 ? steps : ensureSteps();
      if (stepIndex >= next.length) return;
      applyStep(next[stepIndex]);
      setStepIndex((current) => current + 1);
    },
  };
};
