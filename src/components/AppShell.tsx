import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutDashboard, Shield, Network, Github } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";
import { useStakingData } from "@/hooks/useStakingData";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/store/wallet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { isOwner, network, paused } = useStakingData();
  const { network: storeNet, setNetwork } = useWalletStore();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isOwner ? [{ to: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground glow-primary">
            <span className="text-sm font-black">S</span>
          </div>
          <span className="hidden sm:inline gradient-text-primary">StackVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {paused && (
            <Badge variant="outline" className="border-amber-400/40 text-amber-400 hidden sm:flex">
              Paused
            </Badge>
          )}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1.5 bg-secondary/40">
            <Network className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              {network === "mainnet" ? "Mainnet" : "Testnet"}
            </span>
            <Switch
              checked={storeNet === "mainnet"}
              onCheckedChange={(c) => setNetwork(c ? "mainnet" : "testnet")}
            />
          </div>
          <ConnectButton size="sm" />
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border/40 grid grid-cols-3 px-2 py-2">
        {links.map((l) => {
          const active = path === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 rounded-lg text-xs font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <l.icon className="h-5 w-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 mt-20 py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} StackVault. Non-custodial STX staking.</div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" /> GitHub
        </a>
      </div>
    </footer>
  );
}
