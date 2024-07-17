import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

const { ethers } = require('ethers');

export interface AssetServiceAttributes {
  transferToken(toAddress: string): Promise<void>;
}

interface AssetServiceConstructor {
  config: any;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

const provider = new ethers.JsonRpcProvider('https://mainnet.optimism.io');
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
                'name':'',
                'type':'address'
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
  private readonly config: any; 
  
  private readonly contract: any;

  private readonly logger: loggerInterfaces.ILogger;

  constructor({ loggerHandler, config }: AssetServiceConstructor) {
    this.logger = loggerHandler('AssetService');
    this.config = config;
    this.contract = new ethers.Contract(this.config.assets.contractAddress, contractABI, provider)
  }

  async transferToken(toAddress: string): Promise<void> {
    const amount = 1;
    const tokenId = 1;
    const fromAddress = this.config.assets.address;
    const privateKey = this.config.assets.privateKey;

    try {
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractWithSigner = this.contract.connect(wallet);

        const tx = await contractWithSigner.safeTransferFrom(fromAddress, toAddress, tokenId, amount, '0x');
        await tx.wait();
        this.logger.logInfo('Transacción enviada:', tx);
    } catch (error) {
        console.error('Error al transferir el token:', error);
    }
  }
}
