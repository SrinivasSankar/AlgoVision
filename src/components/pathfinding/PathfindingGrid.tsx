import { useState } from 'react';
import { GridNode, PathScore, Point } from '@/types';
import { pointKey } from '@/utils/grid';

type InteractionMode = 'wall' | 'erase' | 'moveStart' | 'moveTarget' | null;

interface PathfindingGridProps {
  grid: GridNode[][];
  startNode: Point;
  targetNode: Point;
  disabled: boolean;
  scores?: Record<string, PathScore>;
  selected?: Point;
  onToggleWall: (point: Point) => void;
  onMoveStart: (point: Point) => void;
  onMoveTarget: (point: Point) => void;
}

const cellStyles: Record<GridNode['state'], string> = {
  empty: 'bg-[rgb(var(--color-empty-cell)/0.55)] hover:bg-[rgb(var(--color-empty-cell-hover)/0.78)]',
  wall: 'bg-[rgb(var(--color-wall-cell)/0.88)]',
  start: 'bg-success',
  target: 'bg-accentWarm',
  frontier: 'bg-[rgb(var(--color-frontier)/0.82)]',
  visited: 'bg-[rgb(var(--color-visited)/0.75)]',
  path: 'bg-danger/90',
};

export const PathfindingGrid = ({
  grid,
  startNode,
  targetNode,
  disabled,
  scores = {},
  selected,
  onToggleWall,
  onMoveStart,
  onMoveTarget,
}: PathfindingGridProps) => {
  const [mode, setMode] = useState<InteractionMode>(null);

  const handlePointerDown = (cell: GridNode) => {
    if (disabled) {
      return;
    }
    const point = { row: cell.row, col: cell.col };
    if (cell.state === 'start') {
      setMode('moveStart');
      return;
    }
    if (cell.state === 'target') {
      setMode('moveTarget');
      return;
    }
    setMode(cell.state === 'wall' ? 'erase' : 'wall');
    onToggleWall(point);
  };

  const handlePointerEnter = (cell: GridNode) => {
    if (disabled || !mode) {
      return;
    }
    const point = { row: cell.row, col: cell.col };
    if (mode === 'moveStart' && cell.state !== 'target' && cell.state !== 'wall') {
      onMoveStart(point);
      return;
    }
    if (mode === 'moveTarget' && cell.state !== 'start' && cell.state !== 'wall') {
      onMoveTarget(point);
      return;
    }
    if (mode === 'wall' && cell.state === 'empty') {
      onToggleWall(point);
    }
    if (mode === 'erase' && cell.state === 'wall') {
      onToggleWall(point);
    }
  };

  return (
    <div
      className="grid gap-1 rounded-[2rem] border border-ink/10 bg-panelSoft/80 p-4"
      style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
      onMouseLeave={() => setMode(null)}
      onMouseUp={() => setMode(null)}
    >
      {grid.flat().map((cell) => {
        const isStart = cell.row === startNode.row && cell.col === startNode.col;
        const isTarget = cell.row === targetNode.row && cell.col === targetNode.col;
        const isSelected = selected?.row === cell.row && selected?.col === cell.col;
        return (
          <button
            key={`${cell.row}-${cell.col}`}
            className={`aspect-square rounded-[0.35rem] transition ${cellStyles[cell.state]} ${
              isStart || isTarget || isSelected ? 'ring-2 ring-ink/20' : ''
            }`}
            type="button"
            onMouseDown={() => handlePointerDown(cell)}
            onMouseEnter={() => handlePointerEnter(cell)}
          />
        );
      })}
    </div>
  );
};
