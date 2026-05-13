import { useState } from "react";
import { motion } from "framer-motion";
import { useStakingData } from "@/hooks/useStakingData";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  AddRewardsDialog,
  PauseToggleDialog,
  EmergencyDrainDialog,
  TransferOwnerDialog,
} from "@/components/AdminDialogs";
import { ConnectButton } from "@/components/ConnectButton";
import {
  Shield,
  Coins,
  TrendingUp,
  Users,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  ArrowRightLeft,
  Plus,
  Activity,
} from "lucide-react";
import {
  formatStx,
  microToStx,
  shortAddr,
  getExplorerTx,
  CONTRACT_ID,
} from "@/contracts/stx-staking";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function Admin() {
  const data = useStakingData();
  const [addOpen, setAddOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [drainOpen, setDrainOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  if (!data.address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Admin access required</h2>
          <p className="text-muted-foreground mt-2">
            Connect the contract owner wallet to access admin controls.
          </p>
          <div className="mt-6"><ConnectButton size="lg" /></div>
        </div>
      </div>
    );
  }

  if (!data.isOwner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Not authorized</h2>
          <p className="text-muted-foreground mt-2">
            This wallet is not the vault owner.
          </p>
          <div className="mt-3 text-xs text-muted-foreground font-mono break-all">
            Owner: {data.owner || "—"}
          </div>
        </div>
      </div>
    );
  }

  const totalDepositedStx = microToStx(data.totalDeposited);

  return (
    <div className="px-4 md:px-6 py-6 md:py-10 mx-auto max-w-7xl pb-24 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-violet/20 text-violet border-violet/30 hover:bg-violet/20">
              <Shield className="h-3 w-3 mr-1" /> Owner
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              {shortAddr(data.address, 7, 6)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Vault Admin</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono break-all">{CONTRACT_ID}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-gradient-primary text-primary-foreground glow-primary"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Rewards
          </Button>
          <Button variant="outline" onClick={() => setPauseOpen(true)} className="glass border-border/60">
            {data.paused ? (
              <><PlayCircle className="h-4 w-4 mr-1.5" /> Unpause</>
            ) : (
              <><PauseCircle className="h-4 w-4 mr-1.5" /> Pause</>
            )}
          </Button>
          <Button variant="outline" onClick={() => setTransferOpen(true)} className="glass border-border/60">
            <ArrowRightLeft className="h-4 w-4 mr-1.5" /> Transfer
          </Button>
          <Button variant="outline" onClick={() => setDrainOpen(true)} className="border-destructive/40 text-destructive hover:bg-destructive/10">
            <AlertTriangle className="h-4 w-4 mr-1.5" /> Drain
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Deposited"
          value={`${formatStx(totalDepositedStx)} STX`}
          icon={Coins}
          accent="primary"
        />
        <StatCard
          label="Vault Status"
          value={data.paused ? "Paused" : "Active"}
          icon={data.paused ? PauseCircle : Activity}
          accent={data.paused ? "violet" : "success"}
        />
        <StatCard
          label="Stakers (recent)"
          value={`${new Set(data.txs.map((t) => t.sender_address)).size}`}
          hint="Unique addresses (last 25 txs)"
          icon={Users}
          accent="cyan"
        />
        <StatCard
          label="Vault TX Activity"
          value={`${data.txs.length}`}
          hint="Recent contract calls"
          icon={TrendingUp}
          accent="violet"
        />
      </div>

      {/* Vault details */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="text-sm font-semibold mb-3">Recent Vault Activity</div>
          <div className="space-y-1 max-h-[420px] overflow-auto">
            {data.txs.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                No recent activity.
              </div>
            ) : (
              data.txs.map((tx) => (
                <a
                  key={tx.tx_id}
                  href={getExplorerTx(tx.tx_id, data.network)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl p-3 hover:bg-secondary/50 transition-colors text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant="outline" className="border-border/60 capitalize whitespace-nowrap">
                      {tx.contract_call?.function_name?.replace(/-/g, " ")}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground truncate">
                      {shortAddr(tx.sender_address, 6, 4)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {tx.burn_block_time_iso
                      ? formatDistanceToNow(new Date(tx.burn_block_time_iso), { addSuffix: true })
                      : tx.tx_status}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-semibold mb-3">Owner controls</div>
          <ul className="text-sm space-y-3 text-muted-foreground">
            <li className="flex gap-2"><Plus className="h-4 w-4 text-primary mt-0.5" /> Add STX to the rewards pool — distributed pro-rata.</li>
            <li className="flex gap-2"><PauseCircle className="h-4 w-4 text-violet mt-0.5" /> Pause/unpause deposits and withdrawal requests.</li>
            <li className="flex gap-2"><ArrowRightLeft className="h-4 w-4 text-cyan mt-0.5" /> Transfer ownership to a new principal.</li>
            <li className="flex gap-2"><AlertTriangle className="h-4 w-4 text-destructive mt-0.5" /> Drain unallocated rewards in emergencies.</li>
          </ul>
        </div>
      </div>

      <AddRewardsDialog open={addOpen} onOpenChange={setAddOpen} network={data.network} ownerAddress={data.address} />
      <PauseToggleDialog open={pauseOpen} onOpenChange={setPauseOpen} network={data.network} ownerAddress={data.address} paused={data.paused} />
      <EmergencyDrainDialog open={drainOpen} onOpenChange={setDrainOpen} network={data.network} ownerAddress={data.address} />
      <TransferOwnerDialog open={transferOpen} onOpenChange={setTransferOpen} network={data.network} ownerAddress={data.address} />
    </div>
  );
}
