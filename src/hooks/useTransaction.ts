import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { callContract, type ContractCallParams } from "@/lib/wallet";
import { getExplorerTx, type NetworkMode } from "@/contracts/stx-staking";

export type TxStatus = "idle" | "signing" | "broadcasting" | "success" | "error";

export interface TxState {
  status: TxStatus;
  txid: string | null;
  error: string | null;
}

export function useTransaction(network: NetworkMode) {
  const qc = useQueryClient();
  const [state, setState] = useState<TxState>({
    status: "idle",
    txid: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ status: "idle", txid: null, error: null });
  }, []);

  const send = useCallback(
    async (
      params: Omit<ContractCallParams, "network"> & { network?: string },
      opts?: { successMessage?: string; loadingMessage?: string },
    ) => {
      setState({ status: "signing", txid: null, error: null });
      try {
        const res = await callContract({
          ...params,
          network: params.network ?? network,
        });
        setState({ status: "success", txid: res.txid, error: null });
        toast.success(opts?.successMessage ?? "Transaction submitted", {
          description: "Click to view on explorer",
          action: {
            label: "Explorer",
            onClick: () =>
              window.open(getExplorerTx(res.txid, network), "_blank", "noopener,noreferrer"),
          },
        });
        // Refresh data after broadcast
        setTimeout(() => qc.invalidateQueries({ queryKey: ["stx-staking"] }), 1500);
        return res;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Transaction failed";
        const isCancel = /cancel|reject|denied/i.test(msg);
        setState({
          status: "error",
          txid: null,
          error: isCancel ? "Transaction cancelled" : msg,
        });
        if (!isCancel) toast.error("Transaction failed", { description: msg });
        return null;
      }
    },
    [network, qc],
  );

  return { state, send, reset };
}
