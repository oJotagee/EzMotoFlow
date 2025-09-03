import { ReactNode } from "react";
import clsx from "clsx";

interface SubtitleProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Subtitle({ children, size = 'md', className }: SubtitleProps) {
  return (
    <p className={clsx(
      'text-muted-foreground transition-colors',
      {
        'text-xs': size === 'xs',
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
      className
    )}>
      {children}
    </p>
  );
}