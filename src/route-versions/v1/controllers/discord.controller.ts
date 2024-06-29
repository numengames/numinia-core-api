import Bluebird from 'bluebird';
import { NextFunction, Request, Response } from 'express';

import { DiscordServiceAttributes } from '../../../services/discord.service';
import validateDiscordSendWebhookChatInputParams from '../../../validators/validate-discord-send-webhook-chat-input-params';
import validateDiscordSendWebhookLoginLogoutInputParams from '../../../validators/validate-discord-send-webhook-login-logout-input-params';

export interface DiscordControllerAttributes {
  sendWebhookChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  sendWebhookLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  sendWebhookLogout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
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
      .then(validateDiscordSendWebhookLoginLogoutInputParams)
      .tap(this.discordService.login.bind(this.discordService))
      .then(res.status(204).send.bind(res))
      .catch(next);
  }

  async sendWebhookLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
    Bluebird.resolve(req.body)
      .then(validateDiscordSendWebhookLoginLogoutInputParams)
      .tap(this.discordService.logout.bind(this.discordService))
      .then(res.status(204).send.bind(res))
      .catch(next);
  }

  async sendWebhookChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    Bluebird.resolve(req.body)
      .then(validateDiscordSendWebhookChatInputParams)
      .tap(this.discordService.chat.bind(this.discordService))
      .then(res.status(204).send.bind(res))
      .catch(next);
  }
}
