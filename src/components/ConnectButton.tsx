import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/store/wallet";
import { connectWallet, disconnectWallet } from "@/lib/wallet";
import { shortAddr } from "@/contracts/stx-staking";
import { Wallet, LogOut, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { getExplorerAddr } from "@/contracts/stx-staking";

interface Props {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function ConnectButton({ size = "default", className }: Props) {
  const { address, network, setAddress, disconnect } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const addr = await connectWallet(network);
      if (addr) {
        setAddress(addr);
        toast.success("Wallet connected", { description: shortAddr(addr) });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to connect";
      if (!/cancel|reject/i.test(msg)) toast.error("Connection failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    disconnect();
    toast("Wallet disconnected");
  };

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 1500);
  };

  if (!address) {
    return (
      <Button
        size={size}
        onClick={handleConnect}
        disabled={loading}
        className={`bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 hover:scale-[1.02] transition-all glow-primary ${className ?? ""}`}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {loading ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant="outline"
          className={`glass border-border/60 font-mono text-sm ${className ?? ""}`}
        >
          <span className="h-2 w-2 rounded-full bg-success animate-pulse mr-2" />
          {shortAddr(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 glass-strong">
        <DropdownMenuLabel className="font-normal">
          <div className="text-xs text-muted-foreground">Connected</div>
          <div className="font-mono text-xs break-all mt-1">{address}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(getExplorerAddr(address, network), "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
