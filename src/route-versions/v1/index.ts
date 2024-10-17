import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { Router } from 'express';

import MonitRoutes from './routes/monit.routes';
import AssetRoutes from './routes/asset.routes';
import ScoreRoutes from './routes/score.routes';
import PlayerRoutes from './routes/player.routes';
import RewardRoutes from './routes/reward.routes';
import DiscordRoutes from './routes/discord.routes';
import PlayerSessionRoutes from './routes/player-session.routes';

export default () => {
  const router = Router();

  router.use('/asset', new AssetRoutes(loggerHandler).router);
  router.use('/score', new ScoreRoutes(loggerHandler).router);
  router.use('/monit', new MonitRoutes(loggerHandler).router);
  router.use('/player', new PlayerRoutes(loggerHandler).router);
  router.use('/reward', new RewardRoutes(loggerHandler).router);
  router.use('/discord', new DiscordRoutes(loggerHandler).router);
  router.use('/player-session', new PlayerSessionRoutes(loggerHandler).router);

  return router;
};
