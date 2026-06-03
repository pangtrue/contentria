import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100 */
  value?: number;
}

/**
 * Lightweight progress bar matching the shadcn/ui look and API (`<Progress value={n} />`).
 * Dependency-free (no `@radix-ui/react-progress`) so it works without an extra install;
 * swap to the radix version via `npx shadcn add progress` if richer a11y is needed.
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
