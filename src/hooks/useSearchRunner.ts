import { useEffect, useMemo, useState } from 'react';
import { getSearchSteps } from '@/algorithms/search';
import { searchAlgorithms, searchPseudocode } from '@/data/algorithms';
import { searchArray } from '@/data/structures';
import { SearchAlgorithmId, SearchStep } from '@/types';

export const useSearchRunner = (
  algorithm: SearchAlgorithmId,
  target: number,
  speed: number,
  deps: unknown[] = [],
) => {
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | undefined>();
  const [bounds, setBounds] = useState<{ left?: number; right?: number }>({});
  const [explanation, setExplanation] = useState('Run both algorithms to compare how they inspect the same array.');
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(() => searchAlgorithms.find((item) => item.id === algorithm)!, [algorithm]);

  const reset = () => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveIndices([]);
    setEliminatedIndices([]);
    setFoundIndex(undefined);
    setBounds({});
    setExplanation('Run both algorithms to compare how they inspect the same array.');
    setCurrentLine(0);
  };

  useEffect(() => {
    reset();
  }, [algorithm, target, ...deps]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length) return void setIsRunning(false);
    const timer = window.setTimeout(() => {
      const step = steps[stepIndex];
      setActiveIndices(step.activeIndices ?? []);
      if (step.eliminatedIndices) setEliminatedIndices((current) => [...new Set([...current, ...step.eliminatedIndices!])]);
      if (step.foundIndex !== undefined) setFoundIndex(step.foundIndex);
      setBounds({ left: step.leftBound, right: step.rightBound });
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    }, speed);
    return () => window.clearTimeout(timer);
  }, [isRunning, stepIndex, steps, speed]);

  const ensureSteps = () => {
    const next = getSearchSteps(algorithm, searchArray, target);
    setSteps(next);
    return next;
  };

  return {
    algorithmMeta,
    array: searchArray,
    target,
    activeIndices,
    eliminatedIndices,
    foundIndex,
    bounds,
    explanation,
    currentLine,
    elapsedMs: stepIndex * speed,
    pseudocode: searchPseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    startRun: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setActiveIndices([]);
      setEliminatedIndices([]);
      setFoundIndex(undefined);
      setBounds({});
      setExplanation('Run both algorithms to compare how they inspect the same array.');
      setCurrentLine(0);
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
      const step = next[stepIndex];
      setActiveIndices(step.activeIndices ?? []);
      if (step.eliminatedIndices) setEliminatedIndices((current) => [...new Set([...current, ...step.eliminatedIndices!])]);
      if (step.foundIndex !== undefined) setFoundIndex(step.foundIndex);
      setBounds({ left: step.leftBound, right: step.rightBound });
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    },
  };
};
