import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useStakingData } from "@/hooks/useStakingData";
import { microToStx } from "@/contracts/stx-staking";

/** Synthesizes a smooth growth curve to current rewards for visual continuity. */
export function RewardsChart({ range }: { range: "7d" | "30d" | "all" }) {
  const { userRewards } = useStakingData();
  const rewardsNow = microToStx(userRewards);

  const data = useMemo(() => {
    const points = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const arr = [];
    const now = Date.now();
    for (let i = points - 1; i >= 0; i--) {
      const t = now - i * 86_400_000;
      const progress = (points - 1 - i) / Math.max(1, points - 1);
      // Smooth ease-in curve toward current rewards
      const eased = Math.pow(progress, 1.6);
      arr.push({
        date: new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        rewards: +(rewardsNow * eased).toFixed(6),
      });
    }
    return arr;
  }, [range, rewardsNow]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.19 45)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="oklch(0.72 0.19 45)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="oklch(0.68 0.015 270)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="oklch(0.68 0.015 270)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.15 0.006 270 / 0.95)",
              border: "1px solid oklch(1 0 0 / 0.1)",
              borderRadius: 12,
              color: "oklch(0.98 0.005 270)",
              backdropFilter: "blur(20px)",
            }}
            formatter={(v) => [`${Number(v).toFixed(6)} STX`, "Rewards"]}
          />
          <Area
            type="monotone"
            dataKey="rewards"
            stroke="oklch(0.72 0.19 45)"
            strokeWidth={2}
            fill="url(#rewardGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
