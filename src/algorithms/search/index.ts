import { SearchAlgorithmId, SearchStep } from '@/types';

export const getSearchSteps = (
  algorithm: SearchAlgorithmId,
  array: number[],
  target: number,
): SearchStep[] => {
  const steps: SearchStep[] = [];

  if (algorithm === 'linear') {
    for (let index = 0; index < array.length; index += 1) {
      steps.push({
        type: 'inspect',
        activeIndices: [index],
        message: `Linear Search checks index ${index} for target ${target}.`,
        line: 2,
      });
      if (array[index] === target) {
        steps.push({
          type: 'found',
          activeIndices: [index],
          foundIndex: index,
          message: `Target ${target} found at index ${index}.`,
          line: 3,
        });
        return steps;
      }
    }
    steps.push({
      type: 'message',
      message: `Target ${target} was not found after scanning the array.`,
      line: 4,
    });
    return steps;
  }

  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({
      type: 'inspect',
      activeIndices: [mid],
      leftBound: left,
      rightBound: right,
      message: `Binary Search inspects middle index ${mid} with value ${array[mid]}.`,
      line: 3,
    });
    if (array[mid] === target) {
      steps.push({
        type: 'found',
        activeIndices: [mid],
        foundIndex: mid,
        leftBound: left,
        rightBound: right,
        message: `Target ${target} found at index ${mid}.`,
        line: 3,
      });
      return steps;
    }
    if (array[mid] < target) {
      const eliminated = Array.from({ length: mid - left + 1 }, (_, i) => left + i);
      left = mid + 1;
      steps.push({
        type: 'narrow',
        eliminatedIndices: eliminated,
        leftBound: left,
        rightBound: right,
        message: `Discard the left half because ${array[mid]} is smaller than ${target}.`,
        line: 4,
      });
    } else {
      const eliminated = Array.from({ length: right - mid + 1 }, (_, i) => mid + i);
      right = mid - 1;
      steps.push({
        type: 'narrow',
        eliminatedIndices: eliminated,
        leftBound: left,
        rightBound: right,
        message: `Discard the right half because ${array[mid]} is larger than ${target}.`,
        line: 4,
      });
    }
  }

  steps.push({
    type: 'message',
    message: `Target ${target} was not found after the search bounds crossed.`,
    line: 5,
  });
  return steps;
};
