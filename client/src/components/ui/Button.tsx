import { ReactNode } from "react";
import clsx from "clsx";

export interface ButtonProps {
  children: ReactNode;
  testID: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'error' | 'success' | 'off' | 'accent' | 'warning' | '';
  loading?: boolean;
  justIcon?: boolean;
  color?: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: props.color || '' }}
      data-test-id={props.testID}
      disabled={props.disabled}
      onClick={!props.loading && props.onClick || undefined}
      className={clsx(
        `flex items-center h-12 transition-all duration-300 justify-center py-2 px-4 rounded-lg gap-3 
         disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-elegant
         hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`,
        props.className || '',
        {
          // Primary - EzMotoFlow Blue
          "bg-primary text-primary-foreground hover:bg-primary-dark shadow-primary border-0 hover:shadow-glow": 
            props.type === 'primary' || !props.type,
          
          // Secondary - Speed Orange
          "bg-secondary text-secondary-foreground hover:bg-secondary-glow shadow-secondary border-0": 
            props.type === 'secondary',
          
          // Accent - Electric Cyan
          "bg-accent text-accent-foreground hover:bg-accent-glow shadow-accent border-0": 
            props.type === 'accent',
          
          // Success - Racing Green
          "bg-success text-success-foreground hover:opacity-90 border-0": 
            props.type === 'success',
          
          // Warning - Caution Yellow
          "bg-warning text-warning-foreground hover:opacity-90 border-0": 
            props.type === 'warning',
          
          // Error - Alert Red
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-destructive border-0": 
            props.type === 'error',
          
          // Off - Muted gray
          "bg-muted text-muted-foreground hover:bg-muted/80 border border-border": 
            props.type === 'off',
          
          // Custom color
          [`bg-[${props.color}]`]: !props.type && props.color,
          
          // Loading state
          "cursor-not-allowed opacity-75": props.loading
        }
      )}
    >
      {props.loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!(props.justIcon && props.loading) && (
        <>{props.children}</>
      )}
    </button>
  );
}