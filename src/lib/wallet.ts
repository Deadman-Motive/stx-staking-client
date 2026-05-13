/**
 * Wallet helpers using @stacks/connect v8 request API.
 * All functions are client-only.
 */
import { connect, disconnect, isConnected, request, getLocalStorage } from "@stacks/connect";
import type { NetworkMode } from "@/contracts/stx-staking";

export async function connectWallet(network: NetworkMode): Promise<string | null> {
  const result = await connect({
    forceWalletSelect: true,
    enableLocalStorage: true,
  });
  // result.addresses array contains both stx and btc; get first STX address
  const addrs = result.addresses ?? [];
  const stx = addrs.find((a: { symbol?: string; address: string }) => a.symbol === "STX") ?? addrs[0];
  return stx?.address ?? readStoredAddress(network);
}

export function readStoredAddress(network: NetworkMode): string | null {
  try {
    const data = getLocalStorage();
    if (!data) return null;
    const stxAddrs = data.addresses?.stx ?? [];
    if (stxAddrs.length === 0) return null;
    // network mode: testnet addresses start with ST, mainnet with SP/SM
    const match =
      network === "testnet"
        ? stxAddrs.find((a) => a.address.startsWith("ST"))
        : stxAddrs.find((a) => a.address.startsWith("SP") || a.address.startsWith("SM"));
    return (match ?? stxAddrs[0]).address ?? null;
  } catch {
    return null;
  }
}

export function disconnectWallet() {
  try {
    disconnect();
  } catch {
    /* noop */
  }
}

export function walletConnected(): boolean {
  try {
    return isConnected();
  } catch {
    return false;
  }
}

export interface ContractCallParams {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: unknown[];
  postConditions?: unknown[];
  postConditionMode?: number;
  network: string;
}

export async function callContract(params: ContractCallParams): Promise<{ txid: string }> {
  const res = await request("stx_callContract", {
    contract: `${params.contractAddress}.${params.contractName}` as `${string}.${string}`,
    functionName: params.functionName,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functionArgs: params.functionArgs as any,
    network: params.network as "mainnet" | "testnet",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postConditions: params.postConditions as any,
    postConditionMode: params.postConditionMode === 1 ? "deny" : "allow",
  });
  return { txid: (res as { txid?: string }).txid ?? "" };
}
