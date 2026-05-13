import { useEffect } from "react";
import { useWalletStore } from "@/store/wallet";
import { readStoredAddress, walletConnected } from "@/lib/wallet";

/** Re-hydrate connected wallet on mount (client-only). */
export function useWalletHydrate() {
  const { network, address, setAddress } = useWalletStore();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (address) return;
    if (walletConnected()) {
      const stored = readStoredAddress(network);
      if (stored) setAddress(stored);
    }
  }, [address, network, setAddress]);
}
