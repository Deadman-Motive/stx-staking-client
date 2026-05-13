import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  accent?: "primary" | "violet" | "cyan" | "success";
  loading?: boolean;
  className?: string;
}

const accentMap = {
  primary: "from-primary/30 to-primary/0 text-primary",
  violet: "from-violet/30 to-violet/0 text-violet",
  cyan: "from-cyan/30 to-cyan/0 text-cyan",
  success: "from-success/30 to-success/0 text-success",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "primary",
  loading,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass relative overflow-hidden rounded-2xl p-5 shadow-card group",
        "hover:border-primary/40 transition-colors",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl",
          accentMap[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </div>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="text-2xl md:text-3xl font-bold tracking-tight truncate">{value}</div>
          )}
          {hint && (
            <div className="text-xs text-muted-foreground">{hint}</div>
          )}
        </div>
        {Icon && (
          <div className={cn("rounded-xl p-2.5 bg-secondary/60", accentMap[accent].split(" ").pop())}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
