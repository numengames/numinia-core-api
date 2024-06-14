import { Router } from 'express';
import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

import ScoreController, {
  IScoreController,
} from '../controllers/score.controller';
import { scoreService } from '../../../services';

export default class ScoreRoutes {
  router: Router;

  private scoreController: IScoreController;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.scoreController = new ScoreController({
      scoreService,
      loggerHandler,
    });

    this.routes();
  }

  routes(): void {
    this.router.post(
      '/',
      this.scoreController.setGameScore.bind(this.scoreController),
    );
  }
}
