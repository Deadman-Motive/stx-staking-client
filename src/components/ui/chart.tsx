// Minimal stub — we use Recharts directly in custom chart components.
import * as React from "react";
import { ResponsiveContainer } from "recharts";

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { config?: unknown }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    <ResponsiveContainer width="100%" height="100%">
      {children as React.ReactElement}
    </ResponsiveContainer>
  </div>
));
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>;
export const ChartTooltipContent: React.FC = () => null;
export const ChartLegend: React.FC<React.PropsWithChildren> = ({ children }) => <>{children}</>;
export const ChartLegendContent: React.FC = () => null;
export const ChartStyle: React.FC = () => null;
export type ChartConfig = Record<string, { label?: string; color?: string }>;
