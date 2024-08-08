import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

const { ethers } = require('ethers');

export interface AssetServiceAttributes {
  transferToken({ walletId, deliverOption }: Record<string, unknown>): Promise<void>;
}

interface AssetServiceConstructor {
  config: any;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

const contractABI = [
  {
    "inputs": [],
    "type": "constructor",
    "stateMutability": "nonpayable",
  },
  {
    "type": "fallback",
    "stateMutability": "payable",
  },
  {
    "inputs": [],
    "name": "implementation",
    "outputs": [{
      "name": "",
      "type": "address",
      "internalType": "address",
    }],
    "type": "function",
    "stateMutability": "view",
  },
  {
    "type": "receive",
    "stateMutability": "payable",
  }
];

export default class AssetService implements AssetServiceAttributes {
  private readonly assetConfig: any;
  private readonly contract: any;
  private readonly provider: any;
  private readonly logger: loggerInterfaces.ILogger;

  constructor({ loggerHandler, config }: AssetServiceConstructor) {
    this.logger = loggerHandler('AssetService');
    this.assetConfig = config.assets;
  }

  async transferToken({ walletId, deliverOption }: Record<string, unknown>): Promise<void> {
    const amount = 1;
    const tokenId = 3;
    const fromAddress = this.assetConfig.address;
    const privateKey = this.assetConfig.privateKey;

    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const contract = new ethers.Contract(this.assetConfig.contractAddress, contractABI, provider);

    try {
      const wallet = new ethers.Wallet(privateKey, provider);

      const contractWithSigner = contract.connect(wallet);

      const tx = await contractWithSigner.safeTransferFrom(fromAddress, walletId as string, tokenId, amount, '0x');
      await tx.wait();

      this.logger.logInfo('Transaction sent:', tx);
    } catch (error) {
      this.logger.logError('Error transferring the token:', error as Error);
      throw error;
    }
  }
}