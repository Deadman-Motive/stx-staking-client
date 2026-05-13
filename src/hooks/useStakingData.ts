import { useQuery, useQueries } from "@tanstack/react-query";
import {
  getOwner,
  getPaused,
  getTotalDeposited,
  getUserDeposit,
  getUserRewards,
  getPendingWithdrawal,
  getStxBalance,
  getAddressContractTxs,
  CONTRACT_ADDRESS,
} from "@/contracts/stx-staking";
import { useWalletStore } from "@/store/wallet";

export function useStakingData() {
  const { address, network } = useWalletStore();
  const sender = address ?? CONTRACT_ADDRESS;

  const queries = useQueries({
    queries: [
      {
        queryKey: ["stx-staking", "totalDeposited", network],
        queryFn: () => getTotalDeposited(sender, network),
        refetchInterval: 30_000,
      },
      {
        queryKey: ["stx-staking", "paused", network],
        queryFn: () => getPaused(sender, network),
        refetchInterval: 30_000,
      },
      {
        queryKey: ["stx-staking", "owner", network],
        queryFn: () => getOwner(sender, network),
        staleTime: 5 * 60_000,
      },
    ],
  });

  const totalDeposited = queries[0].data ?? 0n;
  const paused = queries[1].data ?? false;
  const owner = queries[2].data ?? "";

  const userDeposit = useQuery({
    queryKey: ["stx-staking", "userDeposit", address, network],
    queryFn: () => getUserDeposit(address!, address!, network),
    enabled: !!address,
    refetchInterval: 15_000,
  });

  const userRewards = useQuery({
    queryKey: ["stx-staking", "userRewards", address, network],
    queryFn: () => getUserRewards(address!, address!, network),
    enabled: !!address,
    refetchInterval: 10_000,
  });

  const pending = useQuery({
    queryKey: ["stx-staking", "pending", address, network],
    queryFn: () => getPendingWithdrawal(address!, address!, network),
    enabled: !!address,
    refetchInterval: 15_000,
  });

  const balance = useQuery({
    queryKey: ["stx-balance", address, network],
    queryFn: () => getStxBalance(address!, network),
    enabled: !!address,
    refetchInterval: 20_000,
  });

  const txs = useQuery({
    queryKey: ["stx-staking", "txs", address, network],
    queryFn: () => getAddressContractTxs(address!, network, 25),
    enabled: !!address,
    refetchInterval: 30_000,
  });

  const isOwner = !!address && !!owner && address === owner;
  const isLoading = queries.some((q) => q.isLoading);

  const poolShare =
    totalDeposited > 0n && userDeposit.data
      ? Number((userDeposit.data * 10_000n) / totalDeposited) / 100
      : 0;

  return {
    address,
    network,
    isOwner,
    owner,
    paused,
    totalDeposited,
    userDeposit: userDeposit.data ?? 0n,
    userRewards: userRewards.data ?? 0n,
    pendingWithdrawal: pending.data ?? false,
    balance: balance.data ?? 0n,
    txs: txs.data ?? [],
    poolShare,
    isLoading,
    isUserLoading: userDeposit.isLoading || userRewards.isLoading,
  };
}
