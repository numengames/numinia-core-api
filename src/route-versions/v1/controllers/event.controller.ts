import Bluebird from 'bluebird';
import { interfaces } from '@numengames/numinia-logger';
import { Request, Response, NextFunction } from 'express';

import { EventServiceAttributes } from '../../../services/event.service';

export interface EventControllerAttributes {
  logEvent: (req: Request, res: Response, next: NextFunction) => void;
}

type EventControllerParams = {
  eventService: EventServiceAttributes
  loggerHandler: (title: string) => interfaces.ILogger;
};

export default class EventController implements EventControllerAttributes {
  private readonly logger;

  private readonly eventService;

  constructor({ loggerHandler, eventService }: EventControllerParams) {
    this.eventService = eventService;
    this.logger = loggerHandler('EventController');
  }

  logEvent(req: Request, res: Response, next: NextFunction): void {
    Bluebird.resolve(req.body)
      .then(res.status(200).send.bind(this))
      .catch(next);
  }
}
