import { createSortingRecorder } from '@/algorithms/sorting/helpers';
import { SortingResult } from '@/types';

export const insertionSortSteps = (input: number[]): SortingResult => {
  const recorder = createSortingRecorder(input);
  const { working } = recorder;

  recorder.markSorted([0], 'Insertion Sort starts with a one-element sorted prefix.', 1);
  for (let index = 1; index < working.length; index += 1) {
    const current = working[index];
    let cursor = index - 1;
    recorder.compare([index], `Lift value ${current} to insert it into the sorted prefix.`, 2);

    while (cursor >= 0) {
      recorder.compare(
        [cursor, cursor + 1],
        `Compare ${current} with ${working[cursor]} while scanning left.`,
        4,
      );
      if (working[cursor] <= current) {
        break;
      }
      recorder.overwrite(
        cursor + 1,
        working[cursor],
        `Shift ${working[cursor]} one step right to open a gap.`,
        5,
      );
      cursor -= 1;
    }

    recorder.overwrite(cursor + 1, current, `Insert ${current} into its correct position.`, 6);
    recorder.markSorted(
      Array.from({ length: index + 1 }, (_, item) => item),
      `The prefix through index ${index} is sorted.`,
      6,
    );
  }

  recorder.done('Insertion Sort completed by growing a sorted prefix.');
  return recorder.result();
};
