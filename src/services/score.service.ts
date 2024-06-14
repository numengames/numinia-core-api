import { Model } from 'mongoose';
import {
  types as modelTypes,
  interfaces as modelInterfaces,
} from '@numengames/numinia-models';
import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

import { gameNotExistError } from '../errors';

export interface IScoreService {
  getUserFromWalletIdLean(
    walletId: string,
  ): Promise<modelInterfaces.UserAttributes | null>;
  setGameScore: (
    params: Partial<modelTypes.GameScoreDocument>,
  ) => Promise<void>;
  getGameByName: (name: string) => Promise<modelInterfaces.GameAttributes>;
}

interface ScoreServiceConstructor {
  UserModel: Model<modelInterfaces.UserAttributes>;
  GameModel: Model<modelInterfaces.GameAttributes>;
  GameScoreModel: Model<modelInterfaces.GameScoreAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

export default class ScoreService implements IScoreService {
  private readonly logger: loggerInterfaces.ILogger;

  private GameModel: Model<modelInterfaces.GameAttributes>;

  private UserModel: Model<modelInterfaces.UserAttributes>;

  private GameScoreModel: Model<modelInterfaces.GameScoreAttributes>;

  constructor({
    UserModel,
    GameModel,
    loggerHandler,
    GameScoreModel,
  }: ScoreServiceConstructor) {
    this.UserModel = UserModel;
    this.GameModel = GameModel;
    this.GameScoreModel = GameScoreModel;
    this.logger = loggerHandler('ScoreService');
  }

  async getUserFromWalletIdLean(
    walletId: string,
  ): Promise<modelInterfaces.UserAttributes | null> {
    this.logger.logInfo(
      `getUserFromWalletIdLean - Trying to get an user by the walletId ${walletId}`,
    );
    const query = { wallet: walletId };
    const filter = { updatedAt: 0 };

    return this.UserModel.findOne(query, filter).lean();
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

  async setGameScore(
    params: Partial<modelTypes.GameScoreDocument>,
  ): Promise<void> {
    this.logger.logInfo(
      `setGameScore - Creating a new game score register from game ${params.game} for user ${params.user}`,
    );
    await this.GameScoreModel.create(params);
  }
}
