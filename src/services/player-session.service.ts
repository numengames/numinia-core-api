import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { interfaces as modelInterfaces } from '@numengames/numinia-models';
import { Model, Types } from 'mongoose';

import { sessionDoesNotExistError } from '../errors';

interface StartSessionParams {
  playerId?: string;
  userAgent: string;
  platform: string;
  spaceName: string;
}

export interface PlayerSessionServiceAttributes {
  endExistingSession(sessionId: string): Promise<void>;
  startNewSession(params: StartSessionParams): Promise<string>;
}

interface PlayerSessionServiceConstructor {
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
  PlayerSessionModel: Model<modelInterfaces.PlayerSessionAttributes>;
}

export default class PlayerSessionService implements PlayerSessionServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;
  private PlayerSessionModel: Model<modelInterfaces.PlayerSessionAttributes>;

  constructor({ PlayerSessionModel, loggerHandler }: PlayerSessionServiceConstructor) {
    this.PlayerSessionModel = PlayerSessionModel;
    this.logger = loggerHandler('PlayerSessionService');
  }

  async startNewSession({ platform, playerId, userAgent, spaceName }: StartSessionParams): Promise<string> {
    const query: modelInterfaces.PlayerSessionAttributes = {
      platform,
      userAgent,
      spaceName,
      isAnonymous: !playerId,
      startAt: new Date(),
    };

    if (playerId) {
      query.playerId = new Types.ObjectId(playerId);
    }

    const sessionDocument = await this.PlayerSessionModel.create(query);
    return sessionDocument._id.toString();
  }

  async endExistingSession(sessionId: string): Promise<void> {
    const sessionDocument = await this.PlayerSessionModel.findByIdAndUpdate(
      sessionId,
      { $set: { endAt: new Date() } },
      { new: true },
    );

    if (!sessionDocument) {
      throw sessionDoesNotExistError('Session not found');
    }
  }
}
