import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const styles = {
  primary: 'bg-accent text-ink hover:bg-accent/90',
  secondary: 'border border-ink/10 bg-panelSoft/80 text-ink hover:bg-panelSoft',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 hover:text-ink',
};

export const Button = ({ children, className = '', variant = 'secondary', ...props }: ButtonProps) => (
  <button
    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
