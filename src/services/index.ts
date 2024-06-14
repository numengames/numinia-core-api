import {
  GameModel,
  UserModel,
  GameScoreModel,
} from '@numengames/numinia-models';
import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';

import ScoreService from './score.service';

export const scoreService = new ScoreService({
  UserModel,
  GameModel,
  loggerHandler,
  GameScoreModel,
});
