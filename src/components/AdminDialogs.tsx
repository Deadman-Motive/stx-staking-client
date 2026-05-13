import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/hooks/useTransaction";
import {
  buildAddRewards,
  buildPause,
  buildUnpause,
  buildEmergencyDrain,
  buildSetOwner,
  formatStx,
  microToStx,
  stxToMicro,
  type NetworkMode,
} from "@/contracts/stx-staking";
import { Loader2, AlertTriangle } from "lucide-react";

interface BaseProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  network: NetworkMode;
  ownerAddress: string;
}

export function AddRewardsDialog({
  open,
  onOpenChange,
  network,
  ownerAddress,
}: BaseProps) {
  const { state, send, reset } = useTransaction(network);
  const [amount, setAmount] = useState("");
  const amt = parseFloat(amount) || 0;

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setAmount("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle>Add Rewards</DialogTitle>
          <DialogDescription>
            Deposit STX into the vault as rewards to be distributed to stakers proportionally.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Amount (STX)</Label>
          <Input
            type="number"
            step="0.000001"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 text-lg font-semibold bg-secondary/40"
          />
          <div className="text-xs text-muted-foreground">
            You will send <span className="text-foreground font-medium">{formatStx(amt)} STX</span> to the vault.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button
            onClick={() =>
              amt > 0 &&
              send(buildAddRewards(ownerAddress, stxToMicro(amt), network), {
                successMessage: `Adding ${formatStx(amt)} STX rewards`,
              })
            }
            disabled={amt <= 0 || state.status === "signing"}
            className="bg-gradient-primary text-primary-foreground"
          >
            {state.status === "signing" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirm…</>
            ) : (
              "Add Rewards"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PauseToggleDialog({
  open,
  onOpenChange,
  network,
  paused,
}: BaseProps & { paused: boolean }) {
  const { state, send, reset } = useTransaction(network);
  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 300);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle>{paused ? "Unpause" : "Pause"} Vault</DialogTitle>
          <DialogDescription>
            {paused
              ? "Resume deposits and withdrawals. Users will be able to interact with the vault again."
              : "Halt all deposits and withdrawal requests. Existing stakes remain safe."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button
            onClick={() =>
              send(paused ? buildUnpause(network) : buildPause(network), {
                successMessage: paused ? "Vault unpaused" : "Vault paused",
              })
            }
            disabled={state.status === "signing"}
            variant={paused ? "default" : "destructive"}
          >
            {state.status === "signing" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirm…</>
            ) : (
              paused ? "Unpause" : "Pause"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EmergencyDrainDialog({ open, onOpenChange, network }: BaseProps) {
  const { state, send, reset } = useTransaction(network);
  const [confirm, setConfirm] = useState("");
  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setConfirm("");
    }, 300);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Emergency Drain
          </DialogTitle>
          <DialogDescription>
            This will drain unallocated rewards from the vault to the owner. Type{" "}
            <span className="font-mono font-bold text-foreground">DRAIN</span> to confirm.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="DRAIN"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="h-12 font-mono"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={confirm !== "DRAIN" || state.status === "signing"}
            onClick={() =>
              send(buildEmergencyDrain(network), { successMessage: "Drain initiated" })
            }
          >
            {state.status === "signing" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirm…</>
            ) : (
              "Drain"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TransferOwnerDialog({ open, onOpenChange, network }: BaseProps) {
  const { state, send, reset } = useTransaction(network);
  const [addr, setAddr] = useState("");
  const valid = /^S[PMT][A-Z0-9]{38,}$/.test(addr.trim());
  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setAddr("");
    }, 300);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : close())}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Ownership</DialogTitle>
          <DialogDescription>
            Permanently hand over ownership of the vault to a new principal. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>New owner address</Label>
          <Input
            placeholder="SP…"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            className="font-mono h-12"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={close}>Cancel</Button>
          <Button
            disabled={!valid || state.status === "signing"}
            onClick={() =>
              send(buildSetOwner(addr.trim(), network), { successMessage: "Ownership transferred" })
            }
            className="bg-gradient-accent text-white"
          >
            {state.status === "signing" ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Confirm…</>
            ) : (
              "Transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { microToStx };
