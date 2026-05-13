import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NetworkMode } from "@/contracts/stx-staking";

interface WalletState {
  address: string | null;
  network: NetworkMode;
  setAddress: (a: string | null) => void;
  setNetwork: (n: NetworkMode) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      network: "mainnet",
      setAddress: (address) => set({ address }),
      setNetwork: (network) => set({ network }),
      disconnect: () => set({ address: null }),
    }),
    { name: "stx-staking-wallet" },
  ),
);
