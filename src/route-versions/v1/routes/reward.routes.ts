import { interfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { rewardService } from '../../../services';
import RewardController from '../controllers/reward.controller';

export default class RewardRoutes {
  router: Router;

  private rewardController;

  constructor(loggerHandler: (title: string) => interfaces.ILogger) {
    this.router = Router();

    this.rewardController = new RewardController({ rewardService, loggerHandler });

    this.routes();
  }

  routes() {
    this.router.get('/list', this.rewardController.getList.bind(this.rewardController));
    this.router.get('/:playerId', this.rewardController.getPlayerRewards.bind(this.rewardController));
    this.router.post('/:playerId', this.rewardController.insertPlayerReward.bind(this.rewardController));
  }
}
