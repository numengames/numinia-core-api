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
    'inputs': [],
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'stateMutability': 'payable',
    'type': 'fallback'
  },
  {
    'inputs': [],
    'name': 'implementation',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address'
      }
    ],
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'stateMutability': 'payable',
    'type': 'receive'
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
    'name': 'safeTransferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
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
    const tokenId = 1;
    const fromAddress = this.assetConfig.address;
    const privateKey = this.assetConfig.privateKey;

    const provider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
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