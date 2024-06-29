import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

import calculateWalletAddress from '../helpers/obfuscate-wallet-address';

export interface DiscordServiceAttributes {
  login(params: Record<string, unknown>): void;
}

interface ScoreServiceConstructor {
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

export default class DiscordService implements DiscordServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;

  private readonly loggerOptions: Record<string, unknown>;

  constructor({ loggerHandler }: ScoreServiceConstructor) {
    this.logger = loggerHandler('DiscordService');
    this.loggerOptions = { level: 'info', discord: true };
  }

  login({ spaceName, userName, spaceUrl, season, walletId }: Record<string, unknown>): void {
    const parsedWallet = calculateWalletAddress(walletId as string);

    this.logger.logInfo(
      `An user enter the space: ${spaceName} with a url: ${spaceUrl} as a user with walletId: ${parsedWallet}, userName: ${userName} (season ${season})`,
      this.loggerOptions,
    );
  }
}
