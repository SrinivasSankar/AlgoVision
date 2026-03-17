import { useEffect, useMemo, useState } from 'react';
import { getSortingSteps } from '@/algorithms/sorting';
import { sortingAlgorithms, sortingPseudocode } from '@/data/algorithms';
import { SortingAlgorithmId, SortingStep } from '@/types';

const initialVisualState = {
  activeIndices: [] as number[],
  sortedIndices: [] as number[],
  pivotIndex: undefined as number | undefined,
  currentLine: 0,
  explanation: 'Prepare the algorithm and start playback to inspect each sorting step.',
  comparisons: 0,
  swaps: 0,
};

interface UseSortingRunnerOptions {
  algorithm: SortingAlgorithmId;
  baseArray: number[];
  speed: number;
  autoResetDependencies?: unknown[];
}

export const useSortingRunner = ({
  algorithm,
  baseArray,
  speed,
  autoResetDependencies = [],
}: UseSortingRunnerOptions) => {
  const [displayArray, setDisplayArray] = useState(baseArray);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [visualState, setVisualState] = useState(initialVisualState);

  const algorithmMeta = useMemo(
    () => sortingAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  const applyStep = (step: SortingStep) => {
    setDisplayArray(step.array);
    setVisualState((current) => ({
      activeIndices: step.activeIndices ?? [],
      sortedIndices: step.sortedIndices ?? current.sortedIndices,
      pivotIndex: step.pivotIndex,
      currentLine: step.line,
      explanation: step.message,
      comparisons: current.comparisons + (step.comparisonsDelta ?? 0),
      swaps: current.swaps + (step.swapsDelta ?? 0),
    }));
  };

  const prepareSteps = () => {
    const result = getSortingSteps(algorithm, baseArray);
    setSteps(result.steps);
    return result.steps;
  };

  const reset = () => {
    setDisplayArray(baseArray);
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setVisualState(initialVisualState);
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
  }, [baseArray, algorithm, ...autoResetDependencies]);

  return {
    algorithmMeta,
    displayArray,
    activeIndices: visualState.activeIndices,
    sortedIndices: visualState.sortedIndices,
    pivotIndex: visualState.pivotIndex,
    currentLine: visualState.currentLine,
    explanation: visualState.explanation,
    comparisons: visualState.comparisons,
    swaps: visualState.swaps,
    elapsedMs: stepIndex * speed,
    isRunning,
    hasStarted: stepIndex > 0,
    pseudocode: sortingPseudocode[algorithm],
    start: () => {
      const nextSteps = prepareSteps();
      setDisplayArray(baseArray);
      setStepIndex(0);
      setVisualState(initialVisualState);
      setIsRunning(nextSteps.length > 0);
    },
    pause: () => setIsRunning(false),
    resume: () => {
      if (stepIndex < steps.length) setIsRunning(true);
    },
    reset,
    stepForward: () => {
      const nextSteps = steps.length > 0 ? steps : prepareSteps();
      if (stepIndex >= nextSteps.length) return;
      applyStep(nextSteps[stepIndex]);
      setStepIndex((current) => current + 1);
    },
  };
};
