import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { playerService, playerSessionService } from '../../../services';
import PlayerController, { PlayerControllerAttributes } from '../controllers/player.controller';

export default class PlayerRoutes {
  router: Router;

  private playerController: PlayerControllerAttributes;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.playerController = new PlayerController({
      playerService,
      loggerHandler,
      playerSessionService,
    });

    this.routes();
  }

  routes(): void {
    this.router.get('/:platform/:id', this.playerController.getPlayerInfo.bind(this.playerController));
    this.router.post('/external', this.playerController.createPlayerFromExternalPlatform.bind(this.playerController));
  }
}
