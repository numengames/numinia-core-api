import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { playerSessionService } from '../../../services';
import PlayerSessionController, { PlayerSessionControllerAttributes } from '../controllers/player-session.controller';

export default class PlayerSessionRoutes {
  router: Router;

  private playerSessionController: PlayerSessionControllerAttributes;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.playerSessionController = new PlayerSessionController({
      loggerHandler,
      playerSessionService,
    });

    this.routes();
  }

  routes(): void {
    this.router.post('/end', this.playerSessionController.endSession.bind(this.playerSessionController));
    this.router.post('/start', this.playerSessionController.startSession.bind(this.playerSessionController));
  }
}
