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
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address'
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address'
      },
      {
        'internalType': 'uint256',
        'name': 'id',
        'type': 'uint256'
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
      },
      {
        'internalType': 'bytes',
        'name': 'data',
        'type': 'bytes'
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "type": "function",
    "stateMutability": "nonpayable",
  },
  {
    "type": "receive",
    "stateMutability": "payable",
  }
];

export default class AssetService implements AssetServiceAttributes {
  private readonly assetConfig: any;
  private readonly provider: any;
  private readonly logger: loggerInterfaces.ILogger;

  constructor({ loggerHandler, config }: AssetServiceConstructor) {
    this.logger = loggerHandler('AssetService');
    this.assetConfig = config.assets;
    this.provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  }

  async transferToken({ walletId, deliverOption }: Record<string, unknown>): Promise<void> {
    if (!walletId) {
      throw new Error('walletId is required');
    }

    const amount = 1;
    const tokenId = 3;
    const fromAddress = this.assetConfig.address;
    const privateKey = this.assetConfig.privateKey;

    const contract = new ethers.Contract(this.assetConfig.contractAddress, contractABI, this.provider);

    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
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