import { GraphEdge, GraphNode, TreeNodeData } from '@/types';

export const graphNodes: GraphNode[] = [
  { id: 'A', label: 'A', x: 90, y: 80 },
  { id: 'B', label: 'B', x: 250, y: 60 },
  { id: 'C', label: 'C', x: 420, y: 100 },
  { id: 'D', label: 'D', x: 150, y: 220 },
  { id: 'E', label: 'E', x: 330, y: 210 },
  { id: 'F', label: 'F', x: 510, y: 220 },
];

export const graphEdges: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'D' },
  { from: 'B', to: 'C' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'D', to: 'E' },
  { from: 'E', to: 'F' },
];

export const treeNodes: TreeNodeData[] = [
  { id: '8', value: 8, x: 320, y: 50, left: '4', right: '12' },
  { id: '4', value: 4, x: 170, y: 150, left: '2', right: '6' },
  { id: '12', value: 12, x: 470, y: 150, left: '10', right: '14' },
  { id: '2', value: 2, x: 90, y: 260 },
  { id: '6', value: 6, x: 250, y: 260 },
  { id: '10', value: 10, x: 390, y: 260 },
  { id: '14', value: 14, x: 550, y: 260 },
];

export const searchArray = [4, 9, 13, 18, 24, 31, 36, 42, 57, 63];
