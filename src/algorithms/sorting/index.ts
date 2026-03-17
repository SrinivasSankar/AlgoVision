import { bubbleSortSteps } from '@/algorithms/sorting/bubbleSort';
import { insertionSortSteps } from '@/algorithms/sorting/insertionSort';
import { mergeSortSteps } from '@/algorithms/sorting/mergeSort';
import { quickSortSteps } from '@/algorithms/sorting/quickSort';
import { selectionSortSteps } from '@/algorithms/sorting/selectionSort';
import { SortingAlgorithmId, SortingResult } from '@/types';

export const getSortingSteps = (
  algorithm: SortingAlgorithmId,
  array: number[],
): SortingResult => {
  switch (algorithm) {
    case 'bubble':
      return bubbleSortSteps(array);
    case 'selection':
      return selectionSortSteps(array);
    case 'insertion':
      return insertionSortSteps(array);
    case 'merge':
      return mergeSortSteps(array);
    case 'quick':
      return quickSortSteps(array);
    default:
      return bubbleSortSteps(array);
  }
};
