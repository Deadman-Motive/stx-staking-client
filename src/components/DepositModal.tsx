import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/hooks/useTransaction";
import { useStakingData } from "@/hooks/useStakingData";
import {
  buildDeposit,
  formatStx,
  microToStx,
  stxToMicro,
  getExplorerTx,
} from "@/contracts/stx-staking";
import { ArrowDownToLine, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: Props) {
  const { address, balance, network } = useStakingData();
  const { state, send, reset } = useTransaction(network);
  const [amount, setAmount] = useState("");

  const balStx = microToStx(balance);
  const reserveStx = 0.005; // gas reserve
  const maxStx = Math.max(0, balStx - reserveStx);
  const amt = parseFloat(amount) || 0;
  const valid = amt > 0 && amt <= maxStx && address;

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setAmount("");
    }, 300);
  };

  const handleDeposit = async () => {
    if (!valid || !address) return;
    const micro = stxToMicro(amt);
    await send(buildDeposit(address, micro, network), {
      successMessage: `Depositing ${formatStx(amt)} STX`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : handleClose())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="rounded-lg bg-primary/15 p-2 text-primary">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            Deposit STX
          </DialogTitle>
          <DialogDescription>
            Stake STX to start earning rewards. Deposits are added instantly.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {state.status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-4"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div>
                <div className="font-semibold text-lg">Transaction submitted</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your deposit is being confirmed on-chain.
                </div>
              </div>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-muted-foreground">
                    Balance: <span className="text-foreground font-medium">{formatStx(balStx)}</span> STX
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-20 h-14 text-xl font-semibold bg-secondary/40 border-border/60"
                    min="0"
                    step="0.000001"
                  />
                  <button
                    onClick={() => setAmount(maxStx.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded"
                  >
                    MAX
                  </button>
                </div>
                {amt > maxStx && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Insufficient balance (reserve {reserveStx} STX for gas)
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-secondary/40 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You'll deposit</span>
                  <span className="font-semibold">{formatStx(amt)} STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network fee (est.)</span>
                  <span>~0.003 STX</span>
                </div>
              </div>

              {state.status === "error" && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  disabled={!valid || state.status === "signing"}
                  className="bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90"
                >
                  {state.status === "signing" ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Confirm in wallet…
                    </>
                  ) : (
                    "Deposit"
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
