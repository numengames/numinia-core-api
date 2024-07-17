import { interfaces } from '@numengames/numinia-logger';
import { Router } from 'express';

import { assetService } from '../../../services';
import AssetController from '../controllers/asset.controller';

export default class AssetRoutes {
  router: Router;

  private assetController;

  constructor(loggerHandler: (title: string) => interfaces.ILogger) {
    this.router = Router();

    this.assetController = new AssetController({ assetService, loggerHandler });

    this.routes();
  }

  routes() {
    this.router.post('/deliver', this.assetController.deliverAsset.bind(this.assetController));
  }
}
