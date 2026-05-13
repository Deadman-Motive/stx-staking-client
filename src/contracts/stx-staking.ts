/**
 * STX Staking Contract Helper
 * Contract: SP16ZGVSEE3FY8M5CNKGWTX59S8PB92DKGQFXH7WA.stx-staking
 */
import {
  fetchCallReadOnlyFunction,
  cvToValue,
  uintCV,
  principalCV,
  Pc,
  PostConditionMode,
  ClarityValue,
} from "@stacks/transactions";
import { STACKS_MAINNET, STACKS_TESTNET, StacksNetwork } from "@stacks/network";

export const CONTRACT_ADDRESS = "SP16ZGVSEE3FY8M5CNKGWTX59S8PB92DKGQFXH7WA";
export const CONTRACT_NAME = "stx-staking";
export const CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as const;

export type NetworkMode = "mainnet" | "testnet";

export const getNetwork = (mode: NetworkMode): StacksNetwork =>
  mode === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;

export const getApiBase = (mode: NetworkMode) =>
  mode === "mainnet"
    ? "https://api.mainnet.hiro.so"
    : "https://api.testnet.hiro.so";

export const getExplorerTx = (txid: string, mode: NetworkMode) =>
  `https://explorer.hiro.so/txid/${txid}?chain=${mode}`;

export const getExplorerAddr = (addr: string, mode: NetworkMode) =>
  `https://explorer.hiro.so/address/${addr}?chain=${mode}`;

const MICRO = 1_000_000n;

export const microToStx = (micro: bigint | number | string): number => {
  const m = typeof micro === "bigint" ? micro : BigInt(micro);
  return Number(m) / Number(MICRO);
};

export const stxToMicro = (stx: number | string): bigint => {
  const n = typeof stx === "string" ? parseFloat(stx) : stx;
  return BigInt(Math.floor(n * Number(MICRO)));
};

export const formatStx = (stx: number, decimals = 4): string => {
  if (!Number.isFinite(stx)) return "0";
  if (stx === 0) return "0";
  if (stx < 0.0001) return "<0.0001";
  return stx.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

export const shortAddr = (addr: string, head = 5, tail = 4): string => {
  if (!addr) return "";
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
};

/* ---------------- Read-only calls ---------------- */
async function readOnly<T = unknown>(
  fn: string,
  args: ClarityValue[],
  sender: string,
  mode: NetworkMode,
): Promise<T> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: fn,
    functionArgs: args,
    network: getNetwork(mode),
    senderAddress: sender,
  });
  return cvToValue(result, true) as T;
}

const unwrap = <T>(v: { value: T; success?: boolean } | T): T => {
  if (v && typeof v === "object" && "value" in (v as object)) {
    return (v as { value: T }).value;
  }
  return v as T;
};

export async function getOwner(sender: string, mode: NetworkMode): Promise<string> {
  const res = await readOnly<{ value: string }>("get-owner", [], sender, mode);
  return unwrap(res) as string;
}

export async function getPaused(sender: string, mode: NetworkMode): Promise<boolean> {
  const res = await readOnly<{ value: boolean }>("get-paused", [], sender, mode);
  return unwrap(res) as boolean;
}

export async function getTotalDeposited(sender: string, mode: NetworkMode): Promise<bigint> {
  const res = await readOnly<{ value: string }>("get-total-deposited", [], sender, mode);
  return BigInt(unwrap(res) as string);
}

export async function getUserDeposit(
  user: string,
  sender: string,
  mode: NetworkMode,
): Promise<bigint> {
  const res = await readOnly<{ value: string }>(
    "get-user-deposit",
    [principalCV(user)],
    sender,
    mode,
  );
  return BigInt(unwrap(res) as string);
}

export async function getUserRewards(
  user: string,
  sender: string,
  mode: NetworkMode,
): Promise<bigint> {
  const res = await readOnly<{ value: string }>(
    "get-user-rewards",
    [principalCV(user)],
    sender,
    mode,
  );
  return BigInt(unwrap(res) as string);
}

export async function getPendingWithdrawal(
  user: string,
  sender: string,
  mode: NetworkMode,
): Promise<boolean> {
  const res = await readOnly<{ value: boolean }>(
    "get-pending-withdrawal",
    [principalCV(user)],
    sender,
    mode,
  );
  return unwrap(res) as boolean;
}

/* --------- STX balance via Hiro API --------- */
export async function getStxBalance(addr: string, mode: NetworkMode): Promise<bigint> {
  const url = `${getApiBase(mode)}/extended/v1/address/${addr}/stx`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch balance");
  const data = await res.json();
  return BigInt(data.balance ?? "0");
}

/* --------- Recent contract txs --------- */
export interface ContractTx {
  tx_id: string;
  tx_status: string;
  burn_block_time_iso: string;
  sender_address: string;
  contract_call?: { function_name: string; function_args?: { repr: string }[] };
  tx_type: string;
}

export async function getAddressContractTxs(
  addr: string,
  mode: NetworkMode,
  limit = 20,
): Promise<ContractTx[]> {
  const url = `${getApiBase(mode)}/extended/v1/address/${addr}/transactions?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).filter(
    (t: ContractTx) =>
      t.tx_type === "contract_call" &&
      t.contract_call &&
      `${(t as unknown as { contract_call: { contract_id: string } }).contract_call.contract_id}` ===
        CONTRACT_ID,
  );
}

/* --------- Tx options builders (used with @stacks/connect request) --------- */
export const txCommon = (mode: NetworkMode) => ({
  network: mode === "mainnet" ? "mainnet" : "testnet",
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  postConditionMode: PostConditionMode.Allow,
});

export const buildDeposit = (sender: string, microAmount: bigint, mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "deposit",
  functionArgs: [uintCV(microAmount)],
  postConditionMode: PostConditionMode.Deny,
  postConditions: [Pc.principal(sender).willSendEq(microAmount).ustx()],
});

export const buildAddRewards = (sender: string, microAmount: bigint, mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "add-rewards",
  functionArgs: [uintCV(microAmount)],
  postConditionMode: PostConditionMode.Deny,
  postConditions: [Pc.principal(sender).willSendEq(microAmount).ustx()],
});

export const buildRequestWithdraw = (mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "request-withdraw",
  functionArgs: [],
});

export const buildProcessWithdraw = (user: string, mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "process-withdraw",
  functionArgs: [principalCV(user)],
});

export const buildPause = (mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "pause",
  functionArgs: [],
});

export const buildUnpause = (mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "unpause",
  functionArgs: [],
});

export const buildEmergencyDrain = (mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "emergency-drain",
  functionArgs: [],
});

export const buildSetOwner = (newOwner: string, mode: NetworkMode) => ({
  ...txCommon(mode),
  functionName: "set-owner",
  functionArgs: [principalCV(newOwner)],
});
