import { Model } from 'mongoose';
import { interfaces as modelInterfaces } from '@numengames/numinia-models';
import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

export interface RewardServiceAttributes {
  getRewardList(): Promise<modelInterfaces.RewardAttributes[]>;
  insertPlayerRewards(params: Partial<modelInterfaces.PlayerRewardAttributes>): Promise<void>;
  getRewardsByPlayerId(params: { playerId: string }): Promise<modelInterfaces.PlayerRewardAttributes[]>;
}

interface RewardServiceConstructor {
  RewardModel: Model<modelInterfaces.RewardAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
  PlayerRewardModel: Model<modelInterfaces.PlayerRewardAttributes>;
}

export default class RewardService implements RewardServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;
  private readonly RewardModel: Model<modelInterfaces.RewardAttributes>;
  private readonly PlayerRewardModel: Model<modelInterfaces.PlayerRewardAttributes>;

  constructor({ RewardModel, PlayerRewardModel, loggerHandler }: RewardServiceConstructor) {
    this.RewardModel = RewardModel;
    this.PlayerRewardModel = PlayerRewardModel;
    this.logger = loggerHandler('RewardService');
  }

  async getRewardsByPlayerId({ playerId }: { playerId: string }): Promise<modelInterfaces.PlayerRewardAttributes[]> {
    return this.PlayerRewardModel.find({ playerId })
      .select('-_id -createdAt -updatedAt')
      .populate({
        path: 'rewardId',
        select: '-_id tokenId blockchain contractAddress name type isActive imageUrl',
      })
      .lean();
  }

  async getRewardList(): Promise<modelInterfaces.RewardAttributes[]> {
    return this.RewardModel.find().lean();
  }

  async insertPlayerRewards(params: Partial<modelInterfaces.PlayerRewardAttributes>): Promise<void> {
    await this.PlayerRewardModel.create(params);
  }
}
