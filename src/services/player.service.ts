import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { interfaces as modelInterfaces, types as modelTypes } from '@numengames/numinia-models';
import { Model } from 'mongoose';

export interface PlayerServiceAttributes {
  getPlayerData(params: { platform: string; id: string }): Promise<modelTypes.PlayerDocument | null>;
  findPlayerByPlatformId(params: { platform: string; id: string }): Promise<modelTypes.PlayerDocument | null>;
  createPlayerFromExternalPlatform(params: {
    platform: string;
    id: string;
    playerName: string;
  }): Promise<modelTypes.PlayerDocument>;
}

interface PlayerServiceConstructor {
  PlayerModel: Model<modelInterfaces.PlayerAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

type DynamicKeys = 'oncyberId' | 'hyperfyId';

export default class PlayerService implements PlayerServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;
  private PlayerModel: Model<modelInterfaces.PlayerAttributes>;

  static queryMap: Record<string, DynamicKeys> = {
    oncyber: 'oncyberId',
    hyperfy: 'hyperfyId',
  };

  constructor({ PlayerModel, loggerHandler }: PlayerServiceConstructor) {
    this.PlayerModel = PlayerModel;
    this.logger = loggerHandler('PlayerService');
  }

  async findPlayerByPlatformId({
    platform,
    id,
  }: {
    platform: string;
    id: string;
  }): Promise<modelTypes.PlayerDocument | null> {
    return platform === 'substrata' ? this.getPlayerDataById(id) : this.findPlayerByField(platform, id);
  }

  async createPlayerFromExternalPlatform({
    platform,
    id,
    playerName,
  }: {
    platform: string;
    id: string;
    playerName: string;
  }): Promise<modelTypes.PlayerDocument> {
    const newPlayerData: Partial<modelInterfaces.PlayerAttributes> = {
      playerName,
      isActive: true,
      isBlocked: false,
      lastConnectionDate: new Date(),
      [PlayerService.queryMap[platform]]: id,
    };

    return this.PlayerModel.create(newPlayerData);
  }

  private async getPlayerDataById(id: string): Promise<modelTypes.PlayerDocument | null> {
    return this.PlayerModel.findById(id);
  }

  private async findPlayerByField(platform: string, id: string): Promise<modelTypes.PlayerDocument | null> {
    const field = PlayerService.queryMap[platform as DynamicKeys];
    if (!field) {
      throw new Error('Invalid platform type');
    }
    return this.PlayerModel.findOne({ [field]: id });
  }

  async getPlayerData({
    platform,
    id,
  }: {
    platform: string;
    id: string;
  }): Promise<modelTypes.PlayerDocument | null> {
    return platform === 'substrata' ? this.getPlayerDataById(id) : this.findPlayerByField(platform, id);
  }
}
