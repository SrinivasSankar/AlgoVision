import { createSortingRecorder } from '@/algorithms/sorting/helpers';
import { SortingResult } from '@/types';

export const mergeSortSteps = (input: number[]): SortingResult => {
  const recorder = createSortingRecorder(input);
  const { working } = recorder;

  const merge = (left: number, mid: number, right: number) => {
    const leftPart = working.slice(left, mid + 1);
    const rightPart = working.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let write = left;

    while (i < leftPart.length && j < rightPart.length) {
      recorder.compare(
        [left + i, mid + 1 + j],
        `Merge Sort compares the front of each half before writing the smaller value.`,
        3,
      );
      if (leftPart[i] <= rightPart[j]) {
        recorder.overwrite(write, leftPart[i], `Write ${leftPart[i]} into the merged region.`, 4);
        i += 1;
      } else {
        recorder.overwrite(write, rightPart[j], `Write ${rightPart[j]} into the merged region.`, 4);
        j += 1;
      }
      write += 1;
    }

    while (i < leftPart.length) {
      recorder.overwrite(write, leftPart[i], `Copy remaining left-half value ${leftPart[i]}.`, 5);
      i += 1;
      write += 1;
    }
    while (j < rightPart.length) {
      recorder.overwrite(write, rightPart[j], `Copy remaining right-half value ${rightPart[j]}.`, 5);
      j += 1;
      write += 1;
    }
  };

  const sort = (left: number, right: number) => {
    if (left >= right) {
      return;
    }
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  sort(0, working.length - 1);
  recorder.markSorted(
    Array.from({ length: working.length }, (_, index) => index),
    'All values are sorted after the final merge.',
    5,
  );
  recorder.done('Merge Sort completed by recursively merging sorted halves.');
  return recorder.result();
};
