import { interfaces as modelInterfaces } from '@numengames/numinia-models';
import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Model } from 'mongoose';

export interface PlayerServiceAttributes {
  createPlayerWithWalletIfNotExist({ walletId, userName }: Record<string, string>): Promise<void>;
}

interface PlayerServiceConstructor {
  PlayerModel: Model<modelInterfaces.PlayerAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

export default class PlayerService implements PlayerServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;

  private PlayerModel: Model<modelInterfaces.PlayerAttributes>;

  constructor({ PlayerModel, loggerHandler }: PlayerServiceConstructor) {
    this.PlayerModel = PlayerModel;
    this.logger = loggerHandler('PlayerService');
  }

  private async doesPlayerByWalletIdExist(walletId: string): Promise<boolean> {
    const playerDocument = await this.PlayerModel.exists({ walletId });
    return playerDocument !== null;
  }

  async createPlayerWithWalletIfNotExist({ walletId, userName }: Record<string, string>): Promise<void> {
    const playerDocumentExists = await this.doesPlayerByWalletIdExist(walletId);

    if (!playerDocumentExists) {
      await this.PlayerModel.create({ walletId, userName });
    }
  }
}
