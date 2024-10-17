import { interfaces } from '@numengames/numinia-logger';
import Bluebird from 'bluebird';
import { NextFunction, Request, Response } from 'express';

import { playerAlreadyExistsError } from '../../../errors';
import playerInfoParser from '../../../parsers/player-info.parser';
import { PlayerServiceAttributes } from '../../../services/player.service';
import { PlayerSessionServiceAttributes } from '../../../services/player-session.service';
import validateGetPlayerInfoInputParams from '../../../validators/validate-get-player-info-input-params';
import validateCreatePlayerFromExternalPlatformParams from '../../../validators/validate-create-player-from-external-platform-input-params';

/**
 * Attributes for the PlayerController
 */
export interface PlayerControllerAttributes {
  /**
   * Controller method to fetch player information by platform ID.
   * Validates input, retrieves the player info, and responds with the result.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  getPlayerInfo: (req: Request, res: Response, next: NextFunction) => void;

  /**
   * Controller method to create a player from an external platform.
   * Validates input, creates the player, and responds with the result.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  createPlayerFromExternalPlatform: (req: Request, res: Response, next: NextFunction) => void;
}

type PlayerControllerParams = {
  playerService: PlayerServiceAttributes;
  playerSessionService: PlayerSessionServiceAttributes;
  loggerHandler: (title: string) => interfaces.ILogger;
};

/**
 * PlayerController handles requests related to player information and creation from external platforms.
 *
 * @implements {PlayerControllerAttributes}
 */
export default class PlayerController implements PlayerControllerAttributes {
  private readonly logger;

  private readonly playerService;

  private readonly playerSessionService;

  /**
   * Constructs a new PlayerController instance.
   * @param {Object} params - The parameters to initialize the controller.
   * @param {PlayerServiceAttributes} params.playerService - The service used to manage player operations.
   * @param {(title: string) => interfaces.ILogger} params.loggerHandler - A function to retrieve a logger instance.
   * @param {PlayerSessionServiceAttributes} params.playerSessionService - The service used to manage player session operations.
   */
  constructor({ loggerHandler, playerService, playerSessionService }: PlayerControllerParams) {
    this.playerService = playerService;
    this.playerSessionService = playerSessionService;
    this.logger = loggerHandler('PlayerController');
  }

  /**
   * Handles fetching player information by their platform ID and type.
   * @private
   * @param {Record<string, string>} params - The request parameters.
   * @param {string} params.id - The player's platform-specific ID.
   * @param {string} params.platform - The platform type ('oncyber' or 'hyperfy').
   * @returns {Promise<Object>} Returns player data or a message if the player is not found.
   */
  private async handleGetPlayerInfo(params: Record<string, string>) {
    this.logger.logInfo(
      `handleGetPlayerInfo - Fetching player info for id: ${params.id} and platform: ${params.platform}`,
    );

    const playerDocument = await this.playerService.getPlayerData({
      id: params.id,
      platform: params.platform,
    });

    if (!playerDocument) {
      this.logger.logInfo(
        `handleGetPlayerInfo - Player not found for id: ${params.id} and platform: ${params.platform}`,
      );
      return { message: 'Player not found', player: null };
    }

    this.logger.logInfo(`handleGetPlayerInfo - Player found: ${playerDocument._id}`);
    return { player: playerInfoParser(playerDocument) };
  }

  /**
   * Handles creating a player from an external platform.
   * @private
   * @param {Record<string, string>} params - The request parameters.
   * @param {string} params.id - The player's platform-specific ID.
   * @param {string} params.platform - The platform type ('oncyber' or 'hyperfy').
   * @throws {Error} Throws an error if the player already exists.
   * @returns {Promise<Object>} Returns the newly created player data.
   */
  private async handleCreatePlayerFromExternalPlatform(params: Record<string, string>) {
    this.logger.logInfo(
      `handleCreatePlayerFromExternalPlatform - Attempting to create player with id: ${params.id} and platform: ${params.platform}`,
    );

    const playerDocument = await this.playerService.findPlayerByPlatformId({
      id: params.id,
      platform: params.platform,
    });

    if (playerDocument) {
      this.logger.logError(
        `handleCreatePlayerFromExternalPlatform - Player already exists with id: ${params.id} and platform: ${params.platform}`,
      );
      throw playerAlreadyExistsError(
        `The player you're trying to create with id ${params.id} and platform ${params.platform} already exists`,
      );
    }

    this.logger.logInfo(
      `handleCreatePlayerFromExternalPlatform - Creating new player with id: ${params.id} and platform: ${params.platform}`,
    );
    const newPlayerDocument = await this.playerService.createPlayerFromExternalPlatform({
      id: params.id,
      platform: params.platform,
      playerName: params.playerName,
    });

    this.logger.logInfo(
      `handleCreatePlayerFromExternalPlatform - Player created successfully: ${newPlayerDocument._id}`,
    );
    return { player: playerInfoParser(newPlayerDocument) };
  }

  /**
   * @inheritDoc
   */
  createPlayerFromExternalPlatform(req: Request, res: Response, next: NextFunction): void {
    this.logger.logInfo(
      'createPlayerFromExternalPlatform - Received request to create player from external platform',
    );

    Bluebird.resolve(req.body)
      .then(validateCreatePlayerFromExternalPlatformParams)
      .then(this.handleCreatePlayerFromExternalPlatform.bind(this))
      .then((newPlayer) => res.status(201).json(newPlayer))
      .catch(next);
  }

  /**
   * @inheritDoc
   */
  getPlayerInfo(req: Request, res: Response, next: NextFunction): void {
    this.logger.logInfo(`getPlayerInfo - Received request to fetch player info for id: ${req.params.id}`);

    Bluebird.resolve(req.params)
      .then(validateGetPlayerInfoInputParams)
      .then(this.handleGetPlayerInfo.bind(this))
      .then((playerInfo) => res.status(200).json(playerInfo))
      .catch(next);
  }
}
