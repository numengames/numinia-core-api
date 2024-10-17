import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { eventService } from '../../../services';
import EventController, { EventControllerAttributes } from '../controllers/event.controller';

export default class EventRoutes {
  router: Router;

  private eventController: EventControllerAttributes;

  constructor(loggerHandler: (title: string) => loggerInterfaces.ILogger) {
    this.router = Router();

    this.eventController = new EventController({
      eventService,
      loggerHandler,
    });

    this.routes();
  }

  routes(): void {
    this.router.post('/event', this.eventController.logEvent.bind(this.eventController));
  }
}
