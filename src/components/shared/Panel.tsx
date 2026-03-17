import { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const Panel = ({ title, subtitle, children, className = '' }: PanelProps) => (
  <section
    className={`rounded-3xl border border-ink/10 bg-panel/80 p-5 shadow-glow backdrop-blur ${className}`}
  >
    {(title || subtitle) && (
      <header className="mb-4">
        {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
        {subtitle && <p className="mt-1 text-sm text-ink">{subtitle}</p>}
      </header>
    )}
    {children}
  </section>
);
