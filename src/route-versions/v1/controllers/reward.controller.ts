import { interfaces } from '@numengames/numinia-logger';
import Bluebird from 'bluebird';
import { Request, Response, NextFunction } from 'express';

import { PlayerServiceAttributes } from '../../../services/player.service';
import { RewardServiceAttributes } from '../../../services/reward.service';
import validateGetRewardsInputParams from '../../../validators/validate-get-rewards-input-params';
import validateInsertPlayerRewardsInputParams from '../../../validators/validate-insert-player-rewards-input-params';

export interface RewardControllerAttributes {
  getList: (req: Request, res: Response, next: NextFunction) => void;
  getPlayerRewards: (req: Request, res: Response, next: NextFunction) => void;
  insertPlayerReward: (req: Request, res: Response, next: NextFunction) => void;
}

type PlayerControllerParams = {
  rewardService: RewardServiceAttributes;
  loggerHandler: (title: string) => interfaces.ILogger;
};

export default class RewardController implements RewardControllerAttributes {
  private readonly logger;

  private readonly rewardService;

  constructor({ loggerHandler, rewardService }: PlayerControllerParams) {
    this.rewardService = rewardService;
    this.logger = loggerHandler('RewardController');
  }

  getList(req: Request, res: Response, next: NextFunction): void {
  }

  getPlayerRewards(req: Request, res: Response, next: NextFunction): void {
    Bluebird.resolve(req.params)
      .then(validateGetRewardsInputParams)
      .then(this.rewardService.getRewardsByPlayerId.bind(this.rewardService))
      .then(res.status(200).send.bind(res))
      .catch(next);
  }

  insertPlayerReward(req: Request, res: Response, next: NextFunction): void {
    Bluebird.resolve({ ...req.params, ...req.body })
      .then(validateInsertPlayerRewardsInputParams)
      .then(this.rewardService.insertPlayerRewards.bind(this.rewardService))
      .then(res.status(201).send.bind(res))
      .catch(next);
  }
}
