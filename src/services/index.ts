import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { GameModel, GameScoreModel, PlayerModel } from '@numengames/numinia-models';

import ScoreService from './score.service';
import PlayerService from './player.service';
import DiscordService from './discord.service';

export const scoreService = new ScoreService({
  GameModel,
  PlayerModel,
  loggerHandler,
  GameScoreModel,
});

export const discordService = new DiscordService({ loggerHandler });
export const playerService = new PlayerService({ PlayerModel, loggerHandler });
