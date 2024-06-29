import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { discordService } from '../../../services';
import DiscordController, { DiscordControllerAttributes } from '../controllers/discord.controller';

export default class DiscordRoutes {
  router: Router;

  discordController: DiscordControllerAttributes;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.discordController = new DiscordController({ discordService });

    this.routes();
  }

  routes() {
    this.router.post(
      '/sendWebHook/login',
      this.discordController.sendWebhookLogin.bind(this.discordController),
    );
  }
}
