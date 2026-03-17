import { SortingResult, SortingStep } from '@/types';

export const createSortingRecorder = (initial: number[]) => {
  const working = [...initial];
  const steps: SortingStep[] = [];
  const sorted = new Set<number>();

  const record = (step: Omit<SortingStep, 'array' | 'sortedIndices'>) => {
    steps.push({
      ...step,
      array: [...working],
      sortedIndices: [...sorted],
    });
  };

  return {
    working,
    steps,
    sorted,
    compare: (indices: number[], message: string, line: number) =>
      record({
        type: 'compare',
        activeIndices: indices,
        comparisonsDelta: 1,
        message,
        line,
      }),
    swap: (i: number, j: number, message: string, line: number) => {
      [working[i], working[j]] = [working[j], working[i]];
      record({
        type: 'swap',
        activeIndices: [i, j],
        swapsDelta: 1,
        message,
        line,
      });
    },
    overwrite: (index: number, value: number, message: string, line: number) => {
      working[index] = value;
      record({
        type: 'overwrite',
        activeIndices: [index],
        swapsDelta: 1,
        message,
        line,
      });
    },
    markSorted: (indices: number[], message: string, line: number) => {
      indices.forEach((index) => sorted.add(index));
      record({
        type: 'markSorted',
        activeIndices: indices,
        message,
        line,
      });
    },
    setPivot: (index: number, message: string, line: number) =>
      record({
        type: 'setPivot',
        activeIndices: [index],
        pivotIndex: index,
        message,
        line,
      }),
    message: (activeIndices: number[], message: string, line: number) =>
      record({
        type: 'message',
        activeIndices,
        message,
        line,
      }),
    done: (message: string) => {
      for (let index = 0; index < working.length; index += 1) {
        sorted.add(index);
      }
      record({
        type: 'message',
        message,
        line: 0,
      });
    },
    result: (): SortingResult => ({
      steps,
      sortedArray: [...working],
    }),
  };
};
