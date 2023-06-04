import {SubstrateEvent,} from "@subql/types";
import { Account, GenericSubstrateAccount, Transfer } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";

// We have two handlers here to allow us to save the correct source network of the transfer
export async function handlePolkadotEvent(e: SubstrateEvent): Promise<void> {
  await handleEvent(e, "polkadot");
}

export async function handleKusamaEvent(e: SubstrateEvent): Promise<void> {
  await handleEvent(e, "kusama");
}

async function handleEvent(event: SubstrateEvent,network: "polkadot" | "kusama"): Promise<void> {
  
  // The balances.transfer event has the following payload \[from, to, value\] that we can access
  const fromAddress = event.event.data[0] as AccountId;
  const toAddress = event.event.data[1] as AccountId;
  const amount = event.event.data[2];

  // 42 is the encode code for a generic Substrate address
  const fromGenericAddress: string = encodeAddress(decodeAddress(fromAddress.toString()),42);
  const toGenericAddress: string = encodeAddress(decodeAddress(toAddress.toString()),42);

  logger.info("network: " + network)
  logger.info("amount: " + amount)
  logger.info("fromAddress: " + fromAddress)
  logger.info("fromGenericAddress: " + fromGenericAddress)
  logger.info("hash: " + event.block.block.header.hash)
  

  await Promise.all([
    ensureAccount(fromAddress.toString(), fromGenericAddress, network),
    ensureAccount(toAddress.toString(), toGenericAddress, network),
  ]);

  // We prefix the ID with the network name to prevent ID collisions across networks
  const transfer = new Transfer(`${network}-${event.block.block.header.number.toNumber()}-${event.idx}`,
      network,
      toAddress.toString(),
      fromAddress.toString(),
      fromGenericAddress,
      toGenericAddress,
  );
  transfer.blockNumber = event.block.block.header.number.toBigInt();
  transfer.amount = (amount as Balance).toBigInt();
  transfer.txHash = event.block.block.header.hash.toString()
  transfer.save()
}

async function ensureAccount(
  accountId: string,
  publicKey: string,
  network: "polkadot" | "kusama"
): Promise<void> {
  const account = await Account.get(accountId);
  if (!account) {
    await ensureGenericSubstrateAddress(publicKey);
    const newAccount = new Account(accountId,publicKey,network);
    await newAccount.save();
  }
}

async function ensureGenericSubstrateAddress(address: string): Promise<void> {
  const publicKey = await GenericSubstrateAccount.get(address);
  if (!publicKey) {
    await new GenericSubstrateAccount(address.toString()).save();
  }
}

