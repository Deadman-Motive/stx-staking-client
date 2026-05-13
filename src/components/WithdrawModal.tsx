import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/hooks/useTransaction";
import { useStakingData } from "@/hooks/useStakingData";
import {
  buildRequestWithdraw,
  buildProcessWithdraw,
  formatStx,
  microToStx,
  getExplorerTx,
} from "@/contracts/stx-staking";
import { ArrowUpFromLine, ExternalLink, Loader2, CheckCircle2, Hourglass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "request" | "process";
}

export function WithdrawModal({ open, onOpenChange, mode }: Props) {
  const { address, userDeposit, userRewards, network, pendingWithdrawal } = useStakingData();
  const { state, send, reset } = useTransaction(network);

  const depositStx = microToStx(userDeposit);
  const rewardsStx = microToStx(userRewards);
  const totalStx = depositStx + rewardsStx;

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => reset(), 300);
  };

  const handleSubmit = async () => {
    if (!address) return;
    if (mode === "request") {
      await send(buildRequestWithdraw(network), { successMessage: "Withdrawal requested" });
    } else {
      await send(buildProcessWithdraw(address, network), { successMessage: "Withdrawal processed" });
    }
  };

  const isRequest = mode === "request";
  const title = isRequest ? "Request Withdrawal" : "Claim & Withdraw";
  const Icon = isRequest ? Hourglass : ArrowUpFromLine;

  const canSubmit = isRequest
    ? userDeposit > 0n && !pendingWithdrawal
    : pendingWithdrawal;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : handleClose())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-violet/15 p-2 text-violet">
              <Icon className="h-5 w-5" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>
            {isRequest
              ? "Mark your stake for withdrawal. You'll be able to claim it after the request is finalized."
              : "Claim your principal plus accrued rewards back to your wallet."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {state.status === "success" ? (
            <motion.div
              key="ok"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div className="font-semibold text-lg">Transaction submitted</div>
              {state.txid && (
                <a
                  href={getExplorerTx(state.txid, network)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  View on Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <Button onClick={handleClose} className="w-full mt-2">
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-4">
              <div className="rounded-xl bg-secondary/40 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Staked principal</span>
                  <span className="font-semibold">{formatStx(depositStx)} STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accrued rewards</span>
                  <span className="font-semibold text-success">+{formatStx(rewardsStx)} STX</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">You'll receive</span>
                  <span className="text-lg font-bold gradient-text-primary">
                    {formatStx(totalStx)} STX
                  </span>
                </div>
              </div>

              {isRequest && pendingWithdrawal && (
                <div className="text-sm text-amber-400 rounded-lg bg-amber-400/10 p-3">
                  You already have a pending withdrawal. Process it from the dashboard.
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || state.status === "signing"}
                  className="bg-gradient-accent text-white font-semibold hover:opacity-90"
                >
                  {state.status === "signing" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Confirm in wallet…
                    </>
                  ) : isRequest ? (
                    "Request Withdrawal"
                  ) : (
                    "Claim & Withdraw"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
