import { interfaces } from '@numengames/numinia-logger';
import Bluebird from 'bluebird';
import { Request, Response, NextFunction } from 'express';

import { PlayerServiceAttributes } from '../../../services/player.service';
import validateCreatePlayerWithWalletInputParams from '../../../validators/validate-create-player-with-wallet-input-params';

export interface PlayerControllerAttributes {
  createPlayerWithWallet: (req: Request, res: Response, next: NextFunction) => void;
}

type PlayerControllerParams = {
  playerService: PlayerServiceAttributes
  loggerHandler: (title: string) => interfaces.ILogger;
};

export default class PlayerController implements PlayerControllerAttributes {
  private readonly logger;

  private readonly playerService;

  constructor({ loggerHandler, playerService }: PlayerControllerParams) {
    this.playerService = playerService;
    this.logger = loggerHandler('PlayerController');
  }

  createPlayerWithWallet(req: Request, res: Response, next: NextFunction): void {
    Bluebird.resolve(req.body)
      .then(validateCreatePlayerWithWalletInputParams)
      .then(this.playerService.createPlayerWithWalletIfNotExist.bind(this.playerService))
      .then(res.status(201).send.bind(res))
      .catch(next);
  }
}
