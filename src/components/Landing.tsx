import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useStakingData } from "@/hooks/useStakingData";
import { ConnectButton } from "@/components/ConnectButton";
import { Button } from "@/components/ui/button";
import { microToStx, formatStx } from "@/contracts/stx-staking";
import {
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Coins,
} from "lucide-react";

export function Landing() {
  const stakingData = useStakingData();
  const { totalDeposited, address } = stakingData;
  const totalStx = microToStx(totalDeposited);

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="mx-auto max-w-5xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live on Stacks Mainnet
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
          >
            Stake STX. Earn Real Yield.
            <br />
            <span className="gradient-text-primary">Own Your Rewards.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A non-custodial STX staking vault built on Stacks. Deposit, earn proportional rewards
            in STX, and withdraw any time — secured by transparent on-chain logic.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {address ? (
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-semibold h-12 px-8 glow-primary"
              >
                <Link to="/dashboard">
                  Open Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <ConnectButton size="lg" className="h-12 px-8" />
            )}
            <Button asChild variant="ghost" size="lg" className="h-12 px-6">
              <a href="#how" >How it works</a>
            </Button>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto"
          >
            <StatBlock
              label="Total Staked"
              value={`${formatStx(totalStx, 2)} STX`}
              accent="primary"
            />
            <StatBlock
              label="Transactions"
              value={`${useStakingData().txs.length}`}
              accent="violet"
            />
            <StatBlock
              label="Status"
              value="Active"
              accent="success"
              className="col-span-2 md:col-span-1"
            />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 py-20 bg-secondary/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Four steps. <span className="gradient-text">Real yield.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Designed for clarity, transparency, and zero-friction interactions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { i: Wallet, t: "Connect", d: "Link your Leather, Xverse, or Asigna wallet in one click." },
              { i: Coins, t: "Deposit STX", d: "Stake any amount of STX into the non-custodial vault." },
              { i: TrendingUp, t: "Earn Rewards", d: "Rewards stream in proportional to your share — automatically." },
              { i: Zap, t: "Withdraw", d: "Request a withdrawal, then claim your principal + rewards." },
            ].map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                    <s.i className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="font-semibold text-lg">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { i: Shield, t: "Non-custodial", d: "You sign every transaction. The vault never holds your keys." },
              { i: CheckCircle2, t: "Transparent on-chain", d: "All logic is open-source Clarity smart contract." },
              { i: TrendingUp, t: "Proportional rewards", d: "Your share is fair, calculated per-token at deposit time." },
            ].map((s) => (
              <div key={s.t} className="glass rounded-2xl p-6">
                <s.i className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-accent opacity-10" />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to start earning?
              </h3>
              <p className="text-muted-foreground mt-3">
                Connect your wallet to deposit STX and watch rewards accrue in real time.
              </p>
              <div className="mt-6 flex justify-center">
                {address ? (
                  <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground h-12 px-8 glow-primary">
                    <Link to="/dashboard">Open Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                ) : (
                  <ConnectButton size="lg" className="h-12 px-8" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBlock({
  label,
  value,
  accent,
  className,
}: {
  label: string;
  value: string;
  accent: "primary" | "violet" | "success";
  className?: string;
}) {
  const color = {
    primary: "text-primary",
    violet: "text-violet",
    success: "text-success",
  }[accent];
  return (
    <div className={`glass rounded-2xl p-4 ${className ?? ""}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-xl md:text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
