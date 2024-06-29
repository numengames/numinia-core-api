import { createLoggerHandler as loggerHandler } from '@numengames/numinia-logger';
import { Router } from 'express';

import DiscordRoutes from './routes/discord.routes';
import MonitRoutes from './routes/monit.routes';
import ScoreRoutes from './routes/score.routes';

export default () => {
  const router = Router();

  router.use('/score', new ScoreRoutes(loggerHandler).router);
  router.use('/monit', new MonitRoutes(loggerHandler).router);
  router.use('/discord', new DiscordRoutes(loggerHandler).router);

  return router;
};
