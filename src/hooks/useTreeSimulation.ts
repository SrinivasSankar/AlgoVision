import { useEffect, useMemo, useState } from 'react';
import { getTreeSteps } from '@/algorithms/tree';
import { treeAlgorithms, treePseudocode } from '@/data/algorithms';
import { treeNodes } from '@/data/structures';
import { TreeAlgorithmId, TreeStep } from '@/types';

export const useTreeSimulation = () => {
  const [algorithm, setAlgorithm] = useState<TreeAlgorithmId>('inorder');
  const [speed, setSpeed] = useState(420);
  const [steps, setSteps] = useState<TreeStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string>();
  const [visited, setVisited] = useState<string[]>([]);
  const [explanation, setExplanation] = useState(
    'Run a traversal to inspect the order in which the tree is visited.',
  );
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(
    () => treeAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  useEffect(() => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveNode(undefined);
    setVisited([]);
    setExplanation('Run a traversal to inspect the order in which the tree is visited.');
    setCurrentLine(0);
  }, [algorithm]);

  useEffect(() => {
    if (!isRunning) return;
    if (stepIndex >= steps.length) {
      setIsRunning(false);
      return;
    }
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
    algorithm,
    setAlgorithm,
    algorithmMeta,
    nodes: treeNodes,
    speed,
    setSpeed,
    activeNode,
    visited,
    explanation,
    currentLine,
    elapsedMs: stepIndex * speed,
    pseudocode: treePseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    start: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setVisited([]);
      setActiveNode(undefined);
      setExplanation('Run a traversal to inspect the order in which the tree is visited.');
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
      setActiveNode(undefined);
      setVisited([]);
      setExplanation('Run a traversal to inspect the order in which the tree is visited.');
      setCurrentLine(0);
    },
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
