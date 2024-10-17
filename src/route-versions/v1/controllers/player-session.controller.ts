import { interfaces } from '@numengames/numinia-logger';
import { NextFunction, Request, Response } from 'express';

import { PlayerSessionServiceAttributes } from '../../../services/player-session.service';
import validateEndSessionInputParams from '../../../validators/validate-end-session-input-params';
import validateStartSessionInputParams from '../../../validators/validate-start-session-input-params';

/**
 * Attributes for the PlayerController
 */
export interface PlayerSessionControllerAttributes {
  startSession: (req: Request, res: Response, next: NextFunction) => void;
  endSession: (req: Request, res: Response, next: NextFunction) => void;
}

type PlayerSessionControllerParams = {
  playerSessionService: PlayerSessionServiceAttributes;
  loggerHandler: (title: string) => interfaces.ILogger;
};

/**
 * PlayerSessionController handles requests related to player session initializations in platforms.
 *
 * @implements {PlayerSessionControllerAttributes}
 */
export default class PlayerSessionController implements PlayerSessionControllerAttributes {
  private readonly logger;

  private readonly playerSessionService;

  /**
   * Constructs a new PlayerController instance.
   * @param {Object} params - The parameters to initialize the controller.
   * @param {(title: string) => interfaces.ILogger} params.loggerHandler - A function to retrieve a logger instance.
   * @param {PlayerSessionServiceAttributes} params.playerSessionService - The service used to manage player session operations.
   */
  constructor({ loggerHandler, playerSessionService }: PlayerSessionControllerParams) {
    this.playerSessionService = playerSessionService;
    this.logger = loggerHandler('PlayerSessionController');
  }

  /**
   * @inheritDoc
   */
  startSession(req: Request, res: Response, next: NextFunction): void {
    this.logger.logInfo('startSession - Received request to create a new session register');

    Promise.resolve(req.body)
      .then(validateStartSessionInputParams)
      .then(this.playerSessionService.startNewSession.bind(this.playerSessionService))
      .then((sessionId) => res.status(201).json({ sessionId }))
      .catch(next);
  }

  /**
   * @inheritDoc
   */
  endSession(req: Request, res: Response, next: NextFunction): void {
    this.logger.logInfo('endSession - Received request to update an existing session endAt date');

    Promise.resolve(req.body)
      .then(validateEndSessionInputParams)
      .then(({ sessionId }) => this.playerSessionService.endExistingSession(sessionId))
      .then(() => res.status(204).send())
      .catch(next);
  }
}
