import { faker } from '@faker-js/faker';
import { PlayerModel, types as modelTypes, mongoose } from '@numengames/numinia-models';

import { playerService } from '../../../src/services';
import { insertPlayer } from '../../insert-data-to-model';

const testDatabase = require('../../test-db')(mongoose);

describe('PlayerService', () => {
  beforeAll(() => testDatabase.connect());

  afterAll(() => testDatabase.close());

  describe('findPlayerByPlatformId()', () => {
    describe('when the player exists in oncyber', () => {
      let playerDocument: modelTypes.PlayerDocument;

      const oncyberId = faker.string.uuid();

      beforeAll(async () => {
        playerDocument = await insertPlayer({ oncyberId });
      });

      afterAll(() => PlayerModel.deleteOne({ oncyberId }));

      test('it should return the player document', async () => {
        const player = await playerService.findPlayerByPlatformId({ platform: 'oncyber', id: oncyberId });
        expect(player).not.toBeNull();
        expect(player?.playerName).toBe(playerDocument.playerName);
      });
    });

    describe('when the player does not exist in hyperfy', () => {
      const hyperfyId = faker.string.uuid();

      test('it should return null', async () => {
        const player = await playerService.findPlayerByPlatformId({ platform: 'hyperfy', id: hyperfyId });
        expect(player).toBeNull();
      });
    });

    describe('when the player exists in substrata', () => {
      let playerDocument: modelTypes.PlayerDocument;

      beforeAll(async () => {
        playerDocument = await insertPlayer();
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('it should return the player document', async () => {
        const player = await playerService.findPlayerByPlatformId({ platform: 'substrata', id: playerDocument._id.toString() });

        expect(player).not.toBeNull();
        expect(player?.playerName).toBe(playerDocument.playerName);
      });
    });

    describe('when the platform type is invalid', () => {
      test('it should throw an error', async () => {
        await expect(playerService.findPlayerByPlatformId({ platform: 'invalidPlatform', id: 'someId' }))
          .rejects
          .toThrow('Invalid platform type');
      });
    });
  });

  describe('createPlayerFromExternalPlatform()', () => {
    describe('when creating a new player for oncyber', () => {
      const playerName = faker.internet.userName();
      const oncyberId = faker.string.uuid();

      afterAll(() => PlayerModel.deleteOne({ oncyberId }));

      test('it should create and return the new player document', async () => {
        const player = await playerService.createPlayerFromExternalPlatform({
          platform: 'oncyber',
          id: oncyberId,
          playerName,
        });
        expect(player).not.toBeNull();
        expect(player.playerName).toBe(playerName);
        expect(player.oncyberId).toBe(oncyberId);
      });
    });

    describe('when creating a new player for hyperfy', () => {
      const playerName = faker.internet.userName();
      const hyperfyId = faker.string.uuid();

      afterAll(() => PlayerModel.deleteOne({ hyperfyId }));

      test('it should create and return the new player document', async () => {
        const player = await playerService.createPlayerFromExternalPlatform({
          platform: 'hyperfy',
          id: hyperfyId,
          playerName,
        });
        expect(player).not.toBeNull();
        expect(player.playerName).toBe(playerName);
        expect(player.hyperfyId).toBe(hyperfyId);
      });
    });
  });

  describe('getPlayerData()', () => {
    describe('when getting player data by oncyberId', () => {
      let playerDocument: modelTypes.PlayerDocument;

      const oncyberId = faker.string.uuid();

      beforeAll(async () => {
        playerDocument = await insertPlayer({ oncyberId });
      });

      afterAll(() => PlayerModel.deleteOne({ oncyberId }));

      test('it should return the player data', async () => {
        const player = await playerService.getPlayerData({ platform: 'oncyber', id: oncyberId });
        expect(player).not.toBeNull();
        expect(player?.playerName).toBe(playerDocument.playerName);
      });
    });

    describe('when the player does not exist in hyperfy', () => {
      test('it should return null', async () => {
        const player = await playerService.getPlayerData({ platform: 'hyperfy', id: faker.string.uuid() });
        expect(player).toBeNull();
      });
    });

    describe('when getting player data by substrataId', () => {
      let playerDocument: modelTypes.PlayerDocument;

      beforeAll(async () => {
        playerDocument = await insertPlayer();
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('it should return the player data', async () => {
        const player = await playerService.getPlayerData({ platform: 'substrata', id: playerDocument._id.toString() });

        expect(player).not.toBeNull();
        expect(player?.playerName).toBe(playerDocument.playerName);
      });
    });
  });
});
