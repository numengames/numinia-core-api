import { Model } from 'mongoose';
import { interfaces as modelInterfaces } from '@numengames/numinia-models';
import { interfaces as loggerInterfaces } from '@numengames/numinia-logger';

export interface EventServiceAttributes { }

interface EventServiceConstructor {
  EventModel: Model<modelInterfaces.EventAttributes>;
  loggerHandler: (title: string) => loggerInterfaces.ILogger;
}

export default class EventService implements EventServiceAttributes {
  private readonly logger: loggerInterfaces.ILogger;

  private EventModel: Model<modelInterfaces.EventAttributes>;

  constructor({ EventModel, loggerHandler }: EventServiceConstructor) {
    this.EventModel = EventModel;
    this.logger = loggerHandler('LogService');
  }
}
