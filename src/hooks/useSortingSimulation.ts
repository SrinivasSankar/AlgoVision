import { useEffect, useState } from 'react';
import { useSortingRunner } from '@/hooks/useSortingRunner';
import { SortingAlgorithmId } from '@/types';
import { generateRandomArray } from '@/utils/array';

const DEFAULT_SIZE = 25;

export const useSortingSimulation = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmId>('bubble');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(140);
  const [baseArray, setBaseArray] = useState(() => generateRandomArray(DEFAULT_SIZE));
  const runner = useSortingRunner({ algorithm, baseArray, speed });

  useEffect(() => {
    setBaseArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const randomize = () => {
    setBaseArray(generateRandomArray(arraySize));
  };

  return {
    algorithm,
    setAlgorithm,
    ...runner,
    speed,
    setSpeed,
    arraySize,
    setArraySize,
    randomize,
  };
};
