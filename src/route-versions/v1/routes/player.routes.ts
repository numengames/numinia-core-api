import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { playerService } from '../../../services';
import PlayerController, { PlayerControllerAttributes } from '../controllers/player.controller';

export default class PlayerRoutes {
  router: Router;

  private playerController: PlayerControllerAttributes;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.playerController = new PlayerController({
      playerService,
      loggerHandler,
    });

    this.routes();
  }

  routes(): void {
    this.router.post('/create', this.playerController.createPlayerWithWallet.bind(this.playerController));
  }
}
