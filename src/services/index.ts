import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { GameModel, GameScoreModel, UserModel } from '@numengames/numinia-models';

import DiscordService from './discord.service';
import ScoreService from './score.service';

export const scoreService = new ScoreService({
  UserModel,
  GameModel,
  loggerHandler,
  GameScoreModel,
});

export const discordService = new DiscordService({ loggerHandler });
