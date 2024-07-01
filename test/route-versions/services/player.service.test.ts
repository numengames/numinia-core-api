import { faker } from '@faker-js/faker';
import { PlayerModel, mongoose } from '@numengames/numinia-models';

import { playerService } from '../../../src/services';
import { insertPlayer } from '../../insert-data-to-model';

const testDatabase = require('../../test-db')(mongoose);

describe('PlayerService', () => {
  beforeAll(() => testDatabase.connect());

  afterAll(() => testDatabase.close());

  describe('createPlayerWithWalletIfNotExist()', () => {
    describe('when the player exists', () => {
      const userName = faker.internet.userName();
      const walletId = faker.finance.ethereumAddress();

      beforeAll(async () => {
        await insertPlayer({ walletId });
        await playerService.createPlayerWithWalletIfNotExist({ walletId, userName });
      })

      afterAll(() => PlayerModel.deleteOne({ walletId }))

      test('it should not create any user', async () => {
        const playerDocumentExists = await PlayerModel.exists({ userName });
        expect(playerDocumentExists !== null).toBeFalsy()
      });
    });

    describe('when the player not exists', () => {
      const userName = faker.internet.userName();
      const walletId = faker.finance.ethereumAddress();

      beforeAll(async () => {
        await insertPlayer();
        await playerService.createPlayerWithWalletIfNotExist({ walletId, userName });
      })

      afterAll(() => PlayerModel.deleteMany())

      test('it should not create any user', async () => {
        const playerDocumentExists = await PlayerModel.exists({ userName });
        expect(playerDocumentExists !== null).toBeTruthy()
      });
    });
  });
});
