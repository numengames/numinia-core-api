import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

import calculateWalletAddress from '../helpers/obfuscate-wallet-address';

export interface DiscordServiceAttributes {
  chat(params: Record<string, unknown>): void;
  login(params: Record<string, unknown>): void;
  logout(params: Record<string, unknown>): void;
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
      `An user ${userName || 'annonymous'} enter the space: ${spaceName} (${spaceUrl}) (season ${season})${parsedWallet && ' with walletId: ' + parsedWallet}`,
      this.loggerOptions,
    );
  }

  logout({ spaceName, userName, spaceUrl, season, walletId }: Record<string, unknown>): void {
    const parsedWallet = calculateWalletAddress(walletId as string);

    this.logger.logInfo(
      `An user ${userName || 'annonymous'} left the space: ${spaceName} (${spaceUrl}) (season ${season})${parsedWallet && ' with walletId: ' + parsedWallet}`,
      this.loggerOptions,
    );
  }

  chat({ spaceName, userName, message, spaceUrl, season, walletId }: Record<string, unknown>): void {
    const parsedWallet = calculateWalletAddress(walletId as string);

    this.logger.logInfo(
      `An user ${userName || 'annonymous'} sent a chat message in the space: ${spaceName} (${spaceUrl}) (season ${season})${parsedWallet && ' with walletId: ' + parsedWallet}\n${message}`,
      this.loggerOptions,
    );
  }
}
