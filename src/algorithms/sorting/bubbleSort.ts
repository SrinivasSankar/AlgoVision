import { createSortingRecorder } from '@/algorithms/sorting/helpers';
import { SortingResult } from '@/types';

export const bubbleSortSteps = (input: number[]): SortingResult => {
  const recorder = createSortingRecorder(input);
  const { working } = recorder;

  for (let end = working.length - 1; end > 0; end -= 1) {
    for (let index = 0; index < end; index += 1) {
      recorder.compare(
        [index, index + 1],
        `Bubble Sort compares neighbors at ${index} and ${index + 1}.`,
        3,
      );
      if (working[index] > working[index + 1]) {
        recorder.swap(
          index,
          index + 1,
          `The larger value moves right, bubbling toward its final position.`,
          4,
        );
      }
    }
    recorder.markSorted([end], `Index ${end} is now fixed in sorted order.`, 5);
  }

  recorder.markSorted([0], 'The remaining first value is also sorted.', 5);
  recorder.done('Bubble Sort completed. Every element has reached its final position.');
  return recorder.result();
};
