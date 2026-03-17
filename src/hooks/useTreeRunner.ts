import { useEffect, useMemo, useState } from 'react';
import { getTreeSteps } from '@/algorithms/tree';
import { treeAlgorithms, treePseudocode } from '@/data/algorithms';
import { treeNodes } from '@/data/structures';
import { TreeAlgorithmId, TreeStep } from '@/types';

export const useTreeRunner = (algorithm: TreeAlgorithmId, speed: number, deps: unknown[] = []) => {
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string>();
  const [visited, setVisited] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('Start playback to compare tree traversals.');
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(() => treeAlgorithms.find((item) => item.id === algorithm)!, [algorithm]);

  const reset = () => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveNode(undefined);
    setVisited([]);
    setExplanation('Start playback to compare tree traversals.');
    setCurrentLine(0);
  };

  useEffect(() => {
    reset();
  }, [algorithm, ...deps]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length) return void setIsRunning(false);
    const timer = window.setTimeout(() => {
      const step = steps[stepIndex];
      setActiveNode(step.activeNode);
      setVisited(step.visited ?? []);
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    }, speed);
    return () => window.clearTimeout(timer);
  }, [isRunning, stepIndex, steps, speed]);

  const ensureSteps = () => {
    const next = getTreeSteps(algorithm);
    setSteps(next);
    return next;
  };

  return {
    algorithmMeta,
    nodes: treeNodes,
    activeNode,
    visited,
    explanation,
    currentLine,
    elapsedMs: stepIndex * speed,
    pseudocode: treePseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    startRun: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setActiveNode(undefined);
      setVisited([]);
      setExplanation('Start playback to compare tree traversals.');
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
      setActiveNode(step.activeNode);
      setVisited(step.visited ?? []);
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    },
  };
};
