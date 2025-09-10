import { JsonRpcProvider, Wallet, Contract, Log, isAddress, parseUnits } from 'ethers';
const abi = require('./abi.json');
const tokenAbi = require('./tokenAbi.json');
import dotenv from 'dotenv';
import db from '../../models';
dotenv.config();

// Load env values
const providerUrl = process.env.BSC_PROVIDER_URL!;
const contractAddress = process.env.CONTRACT_ADDRESS!;
const privateKey = process.env.PRIVATE_KEY!;

const provider = new JsonRpcProvider(providerUrl);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, abi, wallet);
const tokenAddress = process.env.TOKEN!;
const tokenContract = new Contract(tokenAddress, tokenAbi, wallet);
/**
 * Dynamically call any contract function with args.
 */
export async function callContractFunction(
  functionName: string,
  args: any[] = []
): Promise<{
  status: number;
  txHash?: string;  
  result?: any;
  eventLogs?: any; 
  error?: string;
}> {
  try {
    if (!contract[functionName]) {  
      throw new Error(`Function '${functionName}' not found in contract ABI`);
    }

    // Send the transaction
    const tx = await contract[functionName](...args);
    const receipt = await tx.wait();



    return {
      status: 1,
      txHash: receipt.hash,
      result: receipt,
    };
  } catch (err: any) {
    console.error(`❌ Error calling '${functionName}':`, err);
    return {
      status: 0,
      error: err?.message || 'Unknown error occurred',
    };
  }
}



/**
 * Dynamically call any contract function with args.
 */
export async function callTokenContractFunction(
  functionName: string,
  args: any[] = []
): Promise<{
  status: number;
  txHash?: string;  
  result?: any;
  eventLogs?: any;
  error?: string;
}> {
  console.log(args,functionName)
  try {
    if (!tokenContract[functionName]) {
      throw new Error(`Function '${functionName}' not found in contract ABI`);
    }

    // Send the transaction
    const tx = await tokenContract[functionName](...args);
    const receipt = await tx.wait();



    return {
      status: 1,
      txHash: receipt.hash,
      result: receipt,
    };
  } catch (err: any) {
    console.error(`❌ Error calling '${functionName}':`, err);
    return {
      status: 0,
      error: err?.message || 'Unknown error occurred',
    };
  }
}

/**
 * Fund a buyer with native coin for gas, then prepare an unsigned token transfer
 * transaction that the buyer can sign and send from their wallet.
 *
 * This is useful when the buyer has tokens but no gas to submit the transfer.
 *
 * Params
 * - buyerAddress: recipient of gas funding and the address that will send the token tx
 * - toAddress: token recipient (e.g., platform/admin wallet)
 * - tokenAmount: human-readable amount (e.g., "1.5")
 * - tokenDecimals: decimals for the token (default 18)
 * - gasBufferMultiplier: optional multiplier for a safety buffer (default 1.25x)
 *
 * Returns
 * - status: 1 on success, 0 on failure
 * - fundingTxHash: hash of the native funding tx
 * - unsignedTokenTx: { to, data, value } object that buyer should sign & send
 */
export async function fundBuyerAndBuildTokenTransfer(
  buyerAddress: any,
  tokenAmount: any,
  userId: any,
  toAddress: string = wallet.address, // Default to wallet address if not provided
  tokenDecimals: number = 18,
  gasBufferMultiplier: number = 1.25,
): Promise<{
  status: number;
  fundingTxHash?: string;
  unsignedTokenTx?: { to: string; data: string; value: string };
  error?: string;
}> {
  try {

    // Basic validation
    if (!buyerAddress || !toAddress) throw new Error('buyerAddress and toAddress are required');
    if (!isAddress(buyerAddress)) throw new Error('Invalid buyerAddress');
    if (!isAddress(toAddress)) throw new Error('Invalid toAddress');

    // 1) Prepare calldata for token transfer (prefer safeTransfer, fallback to transfer)
    const amount = parseUnits(tokenAmount, tokenDecimals);
    let data: string | undefined;
    try {
      data = tokenContract.interface.encodeFunctionData('safeTransfer', [toAddress, amount]);
    } catch (_) {
      data = tokenContract.interface.encodeFunctionData('transfer', [toAddress, amount]);
    }
    if (!data) throw new Error('Failed to encode token transfer calldata');

    // 2) Estimate gas for buyer's token transfer
    const txForEstimate = {
      from: buyerAddress,
      to: tokenAddress,
      data,
      value: 0,
    } as any;

    const [gasEstimate, feeData] = await Promise.all([
      provider.estimateGas(txForEstimate),
      provider.getFeeData(),
    ]);

    // Pick a per-unit fee to estimate native cost
    const perUnitFee = feeData.gasPrice ?? feeData.maxFeePerGas ?? parseUnits('0.1', 'gwei');
    const baseCostWei = (gasEstimate as bigint) * (perUnitFee as bigint);

    // Apply buffer multiplier (convert float to fixed-point for bigint math)
    const scaled = Math.max(1, Math.floor(gasBufferMultiplier * 100));
    const bufferCostWei = (baseCostWei * BigInt(scaled)) / BigInt(100);

    // 3) Fund buyer with the computed amount
    const fundTx = await wallet.sendTransaction({
      to: buyerAddress,
      value: bufferCostWei,
    });
    let store  = await db.wallets_histories.create({
      userId: userId,
      txHash: fundTx?.hash || fundTx.hash,
      amount: bufferCostWei,
      status: 1,
    });
    const fundRcpt = await fundTx.wait();

    return {
      status: 1,
      fundingTxHash: fundRcpt?.hash || fundTx.hash,
      unsignedTokenTx: {
        to: tokenAddress,
        data,
        value: '0',
      },
    };
  } catch (err: any) {
    console.error('fundBuyerAndBuil`dTokenTransfer error:', err);
    return {
      status: 0,
      error: err?.message || 'Unknown error occurred',
    };
  }
}

