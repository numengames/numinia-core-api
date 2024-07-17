import Bluebird from 'bluebird';
import { interfaces } from '@numengames/numinia-logger';
import { NextFunction, Request, Response } from 'express';

import { AssetServiceAttributes } from '../../../services/assets.service';
import validateDeliverAssetInputParams from '../../../validators/validate-deliver-asset-input-params';

export interface IAssetController {
  deliverAsset: (req: Request, res: Response, next: NextFunction) => void;
}

type TAssetControllerParams = {
  assetService: AssetServiceAttributes;
  loggerHandler: (title: string) => interfaces.ILogger;
};

export default class AssetController implements IAssetController {
  private readonly logger;

  private readonly assetService;

  constructor({ loggerHandler, assetService }: TAssetControllerParams) {
    this.logger = loggerHandler('AssetController');
    this.assetService = assetService;
  }

  deliverAsset(req: Request, res: Response, next: NextFunction): void {
    Bluebird.resolve(req.body)
      .then(validateDeliverAssetInputParams)
      .then(this.assetService.transferToken.bind(this.assetService))
      .then(res.status(200).send.bind(res))
      .catch(next);
    ;
  }
}
