import { useState } from "react";
import { motion } from "framer-motion";
import { ConnectButton } from "@/components/ConnectButton";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStakingData } from "@/hooks/useStakingData";
import { useTransaction } from "@/hooks/useTransaction";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { RewardsChart } from "@/components/RewardsChart";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Gift,
  Percent,
  PieChart,
  Hourglass,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  formatStx,
  microToStx,
  shortAddr,
  getExplorerTx,
  buildProcessWithdraw,
} from "@/contracts/stx-staking";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const data = useStakingData();
  const { address, network, paused } = data;
  const [deposit, setDeposit] = useState(false);
  const [withdrawMode, setWithdrawMode] = useState<"request" | "process" | null>(null);
  const { state: claimTx, send: claim } = useTransaction(network);

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto mb-5">
            <Coins className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold">Connect your wallet</h2>
          <p className="text-muted-foreground mt-2">
            Connect a Stacks wallet to view your stake, rewards, and manage withdrawals.
          </p>
          <div className="mt-6">
            <ConnectButton size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const depositStx = microToStx(data.userDeposit);
  const rewardsStx = microToStx(data.userRewards);
  const totalPoolStx = microToStx(data.totalDeposited);
  const balanceStx = microToStx(data.balance);
  const apyEstimate = depositStx > 0 ? ((rewardsStx / depositStx) * 100) : 0;

  return (
    <div className="px-4 md:px-6 py-6 md:py-10 mx-auto max-w-7xl pb-24 md:pb-10">
      {/* Top row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Your Vault</div>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connected as <span className="font-mono text-foreground">{shortAddr(address, 7, 6)}</span> ·
            Balance <span className="font-medium text-foreground">{formatStx(balanceStx, 4)} STX</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setDeposit(true)}
            disabled={paused}
            className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 glow-primary"
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" /> Deposit
          </Button>
          <Button
            variant="outline"
            onClick={() => setWithdrawMode("request")}
            disabled={paused || data.userDeposit === 0n || data.pendingWithdrawal}
            className="glass border-border/60"
          >
            <Hourglass className="h-4 w-4 mr-2" /> Request Withdraw
          </Button>
          <Button
            variant="outline"
            onClick={() => setWithdrawMode("process")}
            disabled={!data.pendingWithdrawal}
            className="glass border-border/60"
          >
            <ArrowUpFromLine className="h-4 w-4 mr-2" /> Claim
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="My Staked"
          value={`${formatStx(depositStx)} STX`}
          hint={`${formatStx(totalPoolStx, 0)} STX in vault`}
          icon={Coins}
          accent="primary"
          loading={data.isUserLoading}
        />
        <StatCard
          label="My Rewards"
          value={`${formatStx(rewardsStx, 6)} STX`}
          hint="Auto-refreshing every 10s"
          icon={Gift}
          accent="success"
          loading={data.isUserLoading}
        />
        <StatCard
          label="Effective Yield"
          value={`${apyEstimate.toFixed(2)}%`}
          hint="Rewards / Principal (lifetime)"
          icon={Percent}
          accent="cyan"
          loading={data.isUserLoading}
        />
        <StatCard
          label="Pool Share"
          value={`${data.poolShare.toFixed(4)}%`}
          hint="Your % of total stake"
          icon={PieChart}
          accent="violet"
          loading={data.isUserLoading}
        />
      </div>

      {/* Pending withdrawal callout */}
      {data.pendingWithdrawal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-2xl p-5 border-amber-400/30 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Withdrawal pending</div>
              <div className="text-sm text-muted-foreground">
                You requested a withdrawal — claim to receive your principal + rewards.
              </div>
            </div>
          </div>
          <Button
            onClick={() =>
              claim(buildProcessWithdraw(address, network), { successMessage: "Processing withdrawal" })
            }
            disabled={claimTx.status === "signing"}
            className="bg-gradient-accent text-white"
          >
            {claimTx.status === "signing" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirm…</>
            ) : (
              <>Claim Now <ArrowUpFromLine className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </motion.div>
      )}

      {/* Chart + Activity */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <Tabs defaultValue="7d">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold">Rewards growth</div>
                <div className="text-xs text-muted-foreground">Estimated accrual curve</div>
              </div>
              <TabsList className="bg-secondary/40">
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="7d"><RewardsChart range="7d" /></TabsContent>
            <TabsContent value="30d"><RewardsChart range="30d" /></TabsContent>
            <TabsContent value="all"><RewardsChart range="all" /></TabsContent>
          </Tabs>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold mb-3">Recent Activity</div>
          <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
            {data.txs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                No transactions yet.
              </div>
            ) : (
              data.txs.map((tx) => {
                const ok = tx.tx_status === "success";
                const pending = tx.tx_status === "pending";
                return (
                  <a
                    key={tx.tx_id}
                    href={getExplorerTx(tx.tx_id, network)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-secondary/50 transition-colors group"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        pending
                          ? "bg-amber-400/15 text-amber-400"
                          : ok
                          ? "bg-success/15 text-success"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {pending ? (
                        <Clock className="h-4 w-4" />
                      ) : ok ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize truncate">
                        {tx.contract_call?.function_name?.replace(/-/g, " ") ?? "Call"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tx.burn_block_time_iso
                          ? formatDistanceToNow(new Date(tx.burn_block_time_iso), { addSuffix: true })
                          : "Pending"}
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>

      <DepositModal open={deposit} onOpenChange={setDeposit} />
      <WithdrawModal
        open={withdrawMode !== null}
        onOpenChange={(v) => !v && setWithdrawMode(null)}
        mode={withdrawMode ?? "request"}
      />
    </div>
  );
}
