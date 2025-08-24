import { Slot } from '@radix-ui/react-slot';
import { ReactNode } from 'react';
import clsx from 'clsx';

export interface TitleProps {
  children: ReactNode
  asChild?: boolean;
  bold?: 'light' | 'normal' | 'semibold' | 'bold' | '800' | '900'
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl',
  className?: string
}

export function Title({ 
  asChild = false,
  size = 'md',
  bold = 'bold',
  className = '',
  ...props }: TitleProps
  ) {
  const Comp = asChild ? Slot : 'h2';
  
  return (
    <Comp 
      className={clsx(
        `leading-tight tracking-tight ${className}`, {
          "text-xs md:text-lg": size === 'xs',
          "text-base md:text-xl": size === 'sm',
          "text-base md:text-2xl": size === 'md',
          "text-base md:text-3xl": size === 'lg',
          "text-lg md:text-4xl": size === 'xl',
          "text-xl md:text-5xl": size === '2xl',
          "font-light": bold === 'light',
          "font-normal": bold === 'normal',
          "font-semibold": bold === 'semibold',
          "font-bold": bold === 'bold',
          "font-extrabold": bold === '800',
          "font-black": bold === '900'
        }
      )}
      {...props} 
    />
  );
}