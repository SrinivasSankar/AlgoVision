import { useEffect, useMemo, useState } from 'react';
import { getGraphSteps } from '@/algorithms/graph';
import { graphAlgorithms, graphPseudocode } from '@/data/algorithms';
import { graphEdges, graphNodes } from '@/data/structures';
import { GraphAlgorithmId, GraphStep } from '@/types';

export const useGraphRunner = (algorithm: GraphAlgorithmId, speed: number, deps: unknown[] = []) => {
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string>();
  const [visited, setVisited] = useState<string[]>([]);
  const [frontier, setFrontier] = useState<string[]>([]);
  const [explanation, setExplanation] = useState('Start playback to compare graph traversals.');
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(() => graphAlgorithms.find((item) => item.id === algorithm)!, [algorithm]);

  const reset = () => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveNode(undefined);
    setVisited([]);
    setFrontier([]);
    setExplanation('Start playback to compare graph traversals.');
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
      setFrontier(step.frontier ?? []);
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    }, speed);
    return () => window.clearTimeout(timer);
  }, [isRunning, stepIndex, steps, speed]);

  const ensureSteps = () => {
    const next = getGraphSteps(algorithm);
    setSteps(next);
    return next;
  };

  return {
    algorithmMeta,
    nodes: graphNodes,
    edges: graphEdges,
    activeNode,
    visited,
    frontier,
    explanation,
    currentLine,
    elapsedMs: stepIndex * speed,
    pseudocode: graphPseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    startRun: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setActiveNode(undefined);
      setVisited([]);
      setFrontier([]);
      setExplanation('Start playback to compare graph traversals.');
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
      setFrontier(step.frontier ?? []);
      setExplanation(step.message);
      setCurrentLine(step.line);
      setStepIndex((current) => current + 1);
    },
  };
};
