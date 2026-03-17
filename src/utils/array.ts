export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomArray = (size: number, min = 12, max = 96) =>
  Array.from({ length: size }, () => randomInt(min, max));
