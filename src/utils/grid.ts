import { GridNode, Point } from '@/types';

export const GRID_ROWS = 18;
export const GRID_COLS = 32;

export const isSamePoint = (a: Point, b: Point) => a.row === b.row && a.col === b.col;

export const pointKey = ({ row, col }: Point) => `${row}:${col}`;

export const createGrid = (start: Point, target: Point, walls = new Set<string>()) =>
  Array.from({ length: GRID_ROWS }, (_, row) =>
    Array.from({ length: GRID_COLS }, (_, col): GridNode => {
      const point = { row, col };
      let state: GridNode['state'] = 'empty';
      if (isSamePoint(point, start)) state = 'start';
      else if (isSamePoint(point, target)) state = 'target';
      else if (walls.has(pointKey(point))) state = 'wall';
      return { row, col, state, distance: Infinity };
    }),
  );

export const getNeighbors = ({ row, col }: Point) =>
  [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 },
  ].filter(
    (point) =>
      point.row >= 0 && point.row < GRID_ROWS && point.col >= 0 && point.col < GRID_COLS,
  );

export const manhattanDistance = (a: Point, b: Point) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

export const generateRandomWalls = (start: Point, target: Point, density = 0.24) => {
  const walls = new Set<string>();
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const point = { row, col };
      if (isSamePoint(point, start) || isSamePoint(point, target)) {
        continue;
      }
      if (Math.random() < density) {
        walls.add(pointKey(point));
      }
    }
  }
  return walls;
};
