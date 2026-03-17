import { createSortingRecorder } from '@/algorithms/sorting/helpers';
import { SortingResult } from '@/types';

export const quickSortSteps = (input: number[]): SortingResult => {
  const recorder = createSortingRecorder(input);
  const { working } = recorder;

  const partition = (low: number, high: number) => {
    const pivot = working[high];
    let smaller = low;
    recorder.setPivot(high, `Choose ${pivot} as the pivot for this partition.`, 1);

    for (let index = low; index < high; index += 1) {
      recorder.compare([index, high], `Compare index ${index} with the pivot ${pivot}.`, 2);
      if (working[index] < pivot) {
        recorder.swap(index, smaller, `Move ${working[smaller]} left of the pivot boundary.`, 3);
        smaller += 1;
      }
    }

    recorder.swap(smaller, high, `Place the pivot into its final partition index ${smaller}.`, 4);
    recorder.markSorted([smaller], `The pivot at index ${smaller} is now fixed.`, 4);
    return smaller;
  };

  const sort = (low: number, high: number) => {
    if (low > high) {
      return;
    }
    if (low === high) {
      recorder.markSorted([low], `Single-element partition at index ${low} is sorted.`, 5);
      return;
    }
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, working.length - 1);
  recorder.done('Quick Sort completed after recursively partitioning around pivots.');
  return recorder.result();
};
