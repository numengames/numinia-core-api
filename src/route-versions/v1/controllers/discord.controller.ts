import Bluebird from 'bluebird';
import { NextFunction, Request, Response } from 'express';

import { DiscordServiceAttributes } from '../../../services/discord.service';
import validateDiscordSendWebhookInputParams from '../../../validators/validate-discord-send-webhook-input-params';

export interface DiscordControllerAttributes {
  sendWebhookLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

type TDiscordControllerParams = {
  discordService: DiscordServiceAttributes;
};

export default class DiscordController implements DiscordControllerAttributes {
  private readonly discordService: DiscordServiceAttributes;

  constructor({ discordService }: TDiscordControllerParams) {
    this.discordService = discordService;
  }

  async sendWebhookLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    Bluebird.resolve(req.body)
      .then(validateDiscordSendWebhookInputParams)
      .tap(this.discordService.login.bind(this.discordService))
      .then(res.status(204).send.bind(res))
      .catch(next);
  }
}
