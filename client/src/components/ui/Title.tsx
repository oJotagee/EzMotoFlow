import { ReactNode } from "react";
import clsx from "clsx";

interface TitleProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  bold?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function Title({ children, size = 'md', bold = 'semibold', className }: TitleProps) {
  return (
    <h1 className={clsx(
      'text-foreground transition-colors',
      {
        'text-xs': size === 'xs',
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
        'text-xl': size === 'xl',
        'text-2xl': size === '2xl',
        'text-3xl': size === '3xl',
        'font-thin': bold === 'thin',
        'font-normal': bold === 'normal',
        'font-medium': bold === 'medium',
        'font-semibold': bold === 'semibold',
        'font-bold': bold === 'bold'
      },
      className
    )}>
      {children}
    </h1>
  );
}