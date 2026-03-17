import { createSortingRecorder } from '@/algorithms/sorting/helpers';
import { SortingResult } from '@/types';

export const selectionSortSteps = (input: number[]): SortingResult => {
  const recorder = createSortingRecorder(input);
  const { working } = recorder;

  for (let index = 0; index < working.length; index += 1) {
    let minIndex = index;
    for (let cursor = index + 1; cursor < working.length; cursor += 1) {
      recorder.compare(
        [minIndex, cursor],
        `Selection Sort checks whether index ${cursor} is the new minimum.`,
        4,
      );
      if (working[cursor] < working[minIndex]) {
        minIndex = cursor;
        recorder.message(
          [index, minIndex],
          `A new minimum candidate was found at index ${minIndex}.`,
          4,
        );
      }
    }
    if (minIndex !== index) {
      recorder.swap(index, minIndex, `Place the smallest remaining value at index ${index}.`, 5);
    }
    recorder.markSorted([index], `The prefix through index ${index} is now sorted.`, 5);
  }

  recorder.done('Selection Sort completed after selecting each minimum in sequence.');
  return recorder.result();
};
