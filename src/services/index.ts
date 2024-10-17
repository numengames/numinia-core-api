import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { GameModel, GameScoreModel, PlayerModel, RewardModel, PlayerRewardModel, EventModel, PlayerSessionModel } from '@numengames/numinia-models';

import config from '../config';
import EventService from './event.service';
import ScoreService from './score.service';
import AssetService from './assets.service';
import PlayerService from './player.service';
import RewardService from './reward.service';
import DiscordService from './discord.service';
import PlayerSessionService from './player-session.service';

export const scoreService = new ScoreService({
  GameModel,
  PlayerModel,
  loggerHandler,
  GameScoreModel,
});
export const discordService = new DiscordService({ loggerHandler });
export const assetService = new AssetService({ config, loggerHandler });
export const eventService = new EventService({ EventModel, loggerHandler });
export const playerService = new PlayerService({ PlayerModel, loggerHandler });
export const rewardService = new RewardService({ RewardModel, PlayerRewardModel, loggerHandler });
export const playerSessionService = new PlayerSessionService({ PlayerSessionModel, loggerHandler });
