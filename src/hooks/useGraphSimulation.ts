import { useEffect, useMemo, useState } from 'react';
import { getGraphSteps } from '@/algorithms/graph';
import { graphAlgorithms, graphPseudocode } from '@/data/algorithms';
import { graphEdges, graphNodes } from '@/data/structures';
import { GraphAlgorithmId, GraphStep } from '@/types';

export const useGraphSimulation = () => {
  const [algorithm, setAlgorithm] = useState<GraphAlgorithmId>('bfs');
  const [speed, setSpeed] = useState(320);
  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string>();
  const [visited, setVisited] = useState<string[]>([]);
  const [frontier, setFrontier] = useState<string[]>([]);
  const [explanation, setExplanation] = useState(
    'Start a traversal to watch the frontier expand across the graph.',
  );
  const [currentLine, setCurrentLine] = useState(0);

  const algorithmMeta = useMemo(
    () => graphAlgorithms.find((item) => item.id === algorithm)!,
    [algorithm],
  );

  useEffect(() => {
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setActiveNode(undefined);
    setVisited([]);
    setFrontier([]);
    setExplanation('Start a traversal to watch the frontier expand across the graph.');
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
    algorithm,
    setAlgorithm,
    algorithmMeta,
    nodes: graphNodes,
    edges: graphEdges,
    speed,
    setSpeed,
    activeNode,
    visited,
    frontier,
    explanation,
    currentLine,
    elapsedMs: stepIndex * speed,
    pseudocode: graphPseudocode[algorithm],
    isRunning,
    hasStarted: stepIndex > 0,
    start: () => {
      const next = ensureSteps();
      setStepIndex(0);
      setVisited([]);
      setFrontier([]);
      setActiveNode(undefined);
      setExplanation('Start a traversal to watch the frontier expand across the graph.');
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
      setFrontier([]);
      setExplanation('Start a traversal to watch the frontier expand across the graph.');
      setCurrentLine(0);
    },
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
