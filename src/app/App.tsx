import { useLayoutEffect, useState } from 'react';
import { ComparisonLab } from '@/components/comparison/ComparisonLab';
import { Hero } from '@/components/layout/Hero';
import { GraphVisualizer } from '@/components/graph/GraphVisualizer';
import { PathfindingVisualizer } from '@/components/pathfinding/PathfindingVisualizer';
import { SearchVisualizer } from '@/components/search/SearchVisualizer';
import { SortingVisualizer } from '@/components/sorting/SortingVisualizer';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { TreeVisualizer } from '@/components/tree/TreeVisualizer';
import { SimulatorTab } from '@/types';

type ThemeMode = 'light' | 'dark';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = window.localStorage.getItem('algovision-theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const App = () => {
  const [tab, setTab] = useState<SimulatorTab>('sorting');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('algovision-theme', theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 lg:px-10 ${
        theme === 'dark' ? 'theme-dark text-white' : 'theme-light text-black'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Hero
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        />
        <section className="rounded-[2rem] border border-ink/10 bg-panel/60 p-4 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Interactive Lab</h2>
              <p className="mt-1 text-sm text-ink">
                Each algorithm produces replayable events before the UI animates them.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SegmentedControl
                value={tab}
                onChange={setTab}
                options={[
                  { value: 'sorting', label: 'Sorting' },
                  { value: 'comparison', label: 'Comparison' },
                  { value: 'pathfinding', label: 'Pathfinding' },
                  { value: 'graph', label: 'Graph' },
                  { value: 'tree', label: 'Tree' },
                  { value: 'search', label: 'Search' },
                ]}
              />
            </div>
          </div>
        </section>
        {tab === 'sorting' && <SortingVisualizer />}
        {tab === 'comparison' && <ComparisonLab />}
        {tab === 'pathfinding' && <PathfindingVisualizer />}
        {tab === 'graph' && <GraphVisualizer />}
        {tab === 'tree' && <TreeVisualizer />}
        {tab === 'search' && <SearchVisualizer />}
      </div>
    </div>
  );
};
