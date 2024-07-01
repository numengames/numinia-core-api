import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { interfaces as modelInterfaces, types as modelTypes } from '@numengames/numinia-models';
import { Model } from 'mongoose';

import { gameNotExistError } from '../errors';

export interface IScoreService {
  getPlayerFromWalletIdLean(walletId: string): Promise<modelInterfaces.PlayerAttributes | null>;
  setGameScore: (params: Partial<modelTypes.GameScoreDocument>) => Promise<void>;
  getGameByName: (name: string) => Promise<modelInterfaces.GameAttributes>;
}

interface ScoreServiceConstructor {
  PlayerModel: Model<modelInterfaces.PlayerAttributes>;
  GameModel: Model<modelInterfaces.GameAttributes>;
  GameScoreModel: Model<modelInterfaces.GameScoreAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

export default class ScoreService implements IScoreService {
  private readonly logger: loggerInterfaces.ILogger;

  private GameModel: Model<modelInterfaces.GameAttributes>;

  private PlayerModel: Model<modelInterfaces.PlayerAttributes>;

  private GameScoreModel: Model<modelInterfaces.GameScoreAttributes>;

  constructor({ PlayerModel, GameModel, loggerHandler, GameScoreModel }: ScoreServiceConstructor) {
    this.GameModel = GameModel;
    this.PlayerModel = PlayerModel;
    this.GameScoreModel = GameScoreModel;
    this.logger = loggerHandler('ScoreService');
  }

  async getPlayerFromWalletIdLean(walletId: string): Promise<modelInterfaces.PlayerAttributes | null> {
    this.logger.logInfo(`getPlayerFromWalletIdLean - Trying to get a player by its walletId ${walletId}`);
    const query = { walletId };
    const filter = { updatedAt: 0 };

    return this.PlayerModel.findOne(query, filter).lean();
  }

  async getGameByName(name: string): Promise<modelInterfaces.GameAttributes> {
    this.logger.logInfo('getGameByName - Fetching game information');

    const params = { name };
    const filter = { createdAt: 0, updatedAt: 0 };

    const gameDocument = await this.GameModel.findOne(params, filter).lean();

    if (!gameDocument) {
      throw gameNotExistError();
    }

    return gameDocument;
  }

  async setGameScore(params: Partial<modelTypes.GameScoreDocument>): Promise<void> {
    this.logger.logInfo(
      `setGameScore - Creating a new game score register from game ${params.game} for player ${params.player}`,
    );
    await this.GameScoreModel.create(params);
  }
}
