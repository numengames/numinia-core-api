import { interfaces } from '@numengames/numinia-logger';
import { types as modelTypes } from '@numengames/numinia-models';
import Bluebird from 'bluebird';
import { NextFunction, Request, Response } from 'express';

import { IScoreService } from '../../../services/score.service';
import validateSetGameScoreInputParams from '../../../validators/validate-set-game-score-input-params';

export interface IScoreController {
  setGameScore: (req: Request, res: Response, next: NextFunction) => void;
}

type TScoreControllerParams = {
  scoreService: IScoreService;
  loggerHandler: (title: string) => interfaces.ILogger;
};

export default class ScoreController implements IScoreController {
  private readonly logger;

  private readonly scoreService: IScoreService;

  constructor({ scoreService, loggerHandler }: TScoreControllerParams) {
    this.scoreService = scoreService;
    this.logger = loggerHandler('ScoreController');
  }

  private async handleSetGameScore(params: Record<string, unknown>) {
    const gameDocument = await this.scoreService.getGameByName(params.name as string);

    const userDocument = await this.scoreService.getUserFromWalletIdLean(params.walletId as string);

    await this.scoreService.setGameScore({
      ...(params as Partial<modelTypes.GameScoreDocument>),
      game: gameDocument._id,
      ...(userDocument ? { user: userDocument._id } : {}),
    });
  }

  async setGameScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    Bluebird.resolve(req.body)
      .then(validateSetGameScoreInputParams)
      .then(this.handleSetGameScore.bind(this))
      .then(res.status(201).send.bind(res))
      .catch(next);
  }
}
