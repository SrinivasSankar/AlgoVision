import { useEffect, useMemo, useState } from 'react';
import { getSearchSteps } from '@/algorithms/search';
import { searchAlgorithms, searchPseudocode } from '@/data/algorithms';
import { searchArray } from '@/data/structures';
import { SearchAlgorithmId, SearchStep } from '@/types';

export const useSearchSimulation = () => {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithmId>('linear');
  const [speed, setSpeed] = useState(450);
  const [target, setTarget] = useState(31);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | undefined>();
  const [bounds, setBounds] = useState<{ left?: number; right?: number }>({});
  const [explanation, setExplanation] = useState(
    'Choose a target and run a search to inspect how candidates are tested or eliminated.',
  );
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(
    () => searchAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  useEffect(() => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveIndices([]);
    setEliminatedIndices([]);
    setFoundIndex(undefined);
    setBounds({});
    setExplanation('Choose a target and run a search to inspect how candidates are tested or eliminated.');
    setCurrentLine(0);
  }, [algorithm, target]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length) {
      setIsRunning(false);
      return;
    }
    const timer = window.setTimeout(() => {
      const step = steps[stepIndex];
      setActiveIndices(step.activeIndices ?? []);
      if (step.eliminatedIndices) {
        setEliminatedIndices((current) => [...new Set([...current, ...step.eliminatedIndices!])]);
      }
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
    algorithm,
    setAlgorithm,
    algorithmMeta,
    array: searchArray,
    target,
    setTarget,
    speed,
    setSpeed,
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
    start: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setActiveIndices([]);
      setEliminatedIndices([]);
      setFoundIndex(undefined);
      setBounds({});
      setExplanation('Choose a target and run a search to inspect how candidates are tested or eliminated.');
      setCurrentLine(0);
      setIsRunning(next.length > 0);
    },
    pause: () => setIsRunning(false),
    resume: () => {
      if (stepIndex < steps.length) setIsRunning(true);
    },
    reset: () => {
      setStepIndex(0);
      setIsRunning(false);
      setActiveIndices([]);
      setEliminatedIndices([]);
      setFoundIndex(undefined);
      setBounds({});
      setExplanation('Choose a target and run a search to inspect how candidates are tested or eliminated.');
      setCurrentLine(0);
    },
    stepForward: () => {
      const next = steps.length > 0 ? steps : ensureSteps();
      if (stepIndex >= next.length) return;
      const step = next[stepIndex];
      setActiveIndices(step.activeIndices ?? []);
      if (step.eliminatedIndices) {
        setEliminatedIndices((current) => [...new Set([...current, ...step.eliminatedIndices!])]);
      }
      if (step.foundIndex !== undefined) setFoundIndex(step.foundIndex);
      setBounds({ left: step.leftBound, right: step.rightBound });
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    },
  };
};
