# AlgoVision

AlgoVision is a React + Tailwind educational app for visualizing algorithms step by step. It includes:

- A sorting visualizer for Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort
- A unified comparison lab for side-by-side replay across sorting, pathfinding, graph traversal, tree traversal, and search
- A pathfinding visualizer for BFS, DFS, Dijkstra, and A*
- A graph traversal visualizer for BFS and DFS on a node-link diagram
- A tree traversal visualizer for Preorder, Inorder, Postorder, and Level Order
- A search visualizer for Linear Search and Binary Search
- Replay controls with start, pause, resume, reset, single-step, and speed tuning
- Pseudocode highlighting and explanation panels driven by generated algorithm events

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Project Structure

```text
src/
  app/
  algorithms/
    sorting/
    pathfinding/
  components/
    layout/
    shared/
    sorting/
    pathfinding/
  data/
  hooks/
  utils/
```

## Architecture

The app keeps algorithm logic separate from presentation:

- Each algorithm generates a list of replayable steps first
- UI components never compute sorting or search logic directly
- Hooks handle playback, stepping, and UI state derived from those steps
- Shared panels and controls keep the interface modular

Example event categories used in the project:

- Sorting: `compare`, `swap`, `overwrite`, `markSorted`, `setPivot`
- Pathfinding: `enqueue`, `visitNode`, `updateDistance`, `reconstructPath`
- Graph: `enqueue`, `visit`, `complete`
- Tree: `visit`, `queue`
- Search: `inspect`, `narrow`, `found`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Current MVP Scope

- Responsive single-page interface with Sorting, Comparison, Pathfinding, Graph, Tree, and Search tabs
- Step-driven playback engine for both visualizers
- Live algorithm explanations and pseudocode line highlighting
- Interactive pathfinding grid with walls, draggable endpoints, and obstacle generation

## Notes

- No backend is required
- New algorithms can be added by introducing new step generators and metadata definitions
- Styling is optimized for a modern dark-mode-first portfolio presentation
