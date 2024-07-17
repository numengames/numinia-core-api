import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { Router } from 'express';

import MonitRoutes from './routes/monit.routes';
import AssetRoutes from './routes/asset.routes';
import ScoreRoutes from './routes/score.routes';
import PlayerRoutes from './routes/player.routes';
import DiscordRoutes from './routes/discord.routes';

export default () => {
  const router = Router();

  router.use('/asset', new AssetRoutes(loggerHandler).router);
  router.use('/score', new ScoreRoutes(loggerHandler).router);
  router.use('/monit', new MonitRoutes(loggerHandler).router);
  router.use('/player', new PlayerRoutes(loggerHandler).router);
  router.use('/discord', new DiscordRoutes(loggerHandler).router);

  return router;
};
