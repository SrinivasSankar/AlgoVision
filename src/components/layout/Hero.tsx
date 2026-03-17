import { Button } from '@/components/shared/Button';

interface HeroProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Hero = ({ theme, onToggleTheme }: HeroProps) => (
  <section className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-panel/70 p-8 shadow-glow backdrop-blur">
    <div className="absolute inset-0 bg-grid bg-[size:18px_18px] opacity-30" />
    <div className="relative flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-ink">
          Visual Algorithm Simulator
        </div>
        <Button variant="secondary" onClick={onToggleTheme}>
          Mode: {theme === 'dark' ? 'Dark' : 'Light'}
        </Button>
      </div>
      <div className="max-w-3xl space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
          AlgoVision
        </h1>
        <p className="max-w-2xl text-base leading-8 text-ink md:text-lg">
          Explore sorting and pathfinding algorithms through step-based animation, live metrics,
          pseudocode highlighting, and teaching-focused explanations.
        </p>
      </div>
    </div>
  </section>
);
