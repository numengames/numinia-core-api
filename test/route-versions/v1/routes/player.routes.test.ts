import { faker } from '@faker-js/faker';
import { PlayerModel, types as modelTypes, mongoose } from '@numengames/numinia-models';
import supertest from 'supertest';

import { server } from '../../../../src/server';
import { insertPlayer } from '../../../insert-data-to-model';

const testDatabase = require('../../../test-db')(mongoose);

describe('PlayerRoutes', () => {
  const basePath = '/api/v1/player';

  beforeAll(() => testDatabase.connect());

  afterAll(() => testDatabase.close());

  describe('getPlayerInfo', () => {
    const path = (platform: string, id: string) => `${basePath}/${platform}/${id}`;

    test('should return 422 and Boom.badData when required parameter type is not one of the allowed values (oncyber, hyperfy, user)', async () => {
      await supertest(server.app).get(path('test', faker.string.uuid())).expect(422);
    });

    describe('oncyber player not found', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      beforeAll(async () => {
        playerDocument = await insertPlayer();

        response = await supertest(server.app).get(
          path(
            'oncyber',
            faker.string.uuid(),
          ),
        );
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('should return 200 OK', () => {
        expect(response.statusCode).toBe(200);
      });

      test('should return a message "Player not found" and player: null when no user exists for the combination of id and type oncyber', () => {
        expect(response.body).toEqual({ player: null, message: 'Player not found' });
      });
    });

    describe('hyperfy player not found', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      beforeAll(async () => {
        playerDocument = await insertPlayer();

        response = await supertest(server.app).get(
          path(
            'hyperfy',
            faker.string.uuid(),
          ),
        );
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('should return 200 OK', () => {
        expect(response.statusCode).toBe(200);
      });

      test('should return a message "Player not found" and player: null when no user exists for the combination of id and type hyperfy', () => {
        expect(response.body.player).toBe(null)
        expect(response.body.message).toBe('Player not found');
      });
    });

    describe('player found', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      const id = faker.string.uuid();
      const platform = faker.helpers.arrayElement(['oncyber', 'hyperfy']);

      beforeAll(async () => {
        playerDocument = await insertPlayer({ [`${platform}Id`]: id });

        response = await supertest(server.app).get(path(platform, id));
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('should return 200 OK', () => {
        expect(response.statusCode).toBe(200);
      });

      test('should return 200 with player information when the user is found', async () => {
        expect(response.body.message).not.toBeDefined();
        expect(response.body.player.playerId).toBeDefined()
        expect(response.body.player.playerName).toBe(playerDocument.playerName)
      });
    });
  });

  describe('createPlayerFromExternalPlatform', () => {
    const path = `${basePath}/external`;

    test('missing id parameter - should return 422 and Boom.badData when required parameter id is not defined', async () => {
      const res = await supertest(server.app)
        .post(path)
        .send({
          playerName: faker.internet.userName(),
          platform: faker.helpers.arrayElement(['oncyber', 'hyperfy']),
        })
        .expect(422);

      expect(res.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"id" is required'
      });
    });

    test('missing playerName parameter - should return 422 and Boom.badData when required parameter playerName is not defined', async () => {
      const res = await supertest(server.app)
        .post(path)
        .send({
          id: faker.string.uuid(),
          platform: faker.helpers.arrayElement(['oncyber', 'hyperfy']),
        })
        .expect(422);

      expect(res.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"playerName" is required'
      });
    });

    test('missing type parameter - should return 422 and Boom.badData when required parameter type is not defined', async () => {
      const res = await supertest(server.app)
        .post(path)
        .send({
          id: faker.string.uuid(),
          playerName: faker.internet.userName(),
        })
        .expect(422);

      expect(res.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"platform" is required'
      });
    });

    describe('id already exists', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      const id = faker.string.uuid();
      const platform = faker.helpers.arrayElement(['oncyber', 'hyperfy']);

      beforeAll(async () => {
        playerDocument = await insertPlayer({ [`${platform}Id`]: id });

        response = await supertest(server.app)
          .post(path)
          .send({
            id,
            platform,
            playerName: faker.internet.userName(),
          })
      });

      afterAll(() => PlayerModel.deleteOne({ _id: playerDocument._id }));

      test('should return 409 when id already exists in the database', () => {
        expect(response.body).toEqual({
          statusCode: 409,
          error: 'Conflict',
          message: expect.stringMatching(/The player you're trying to create with id .* and platform .* already exists/)
        });
      });
    });

    describe('player created successfully', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      const playerName = faker.internet.userName();

      beforeAll(async () => {
        response = await supertest(server.app)
          .post(path)
          .send({
            playerName,
            id: faker.string.uuid(),
            platform: faker.helpers.arrayElement(['oncyber', 'hyperfy']),
          })
      });

      afterAll(() => PlayerModel.deleteOne({ _id: response.body.playerId }));

      test('should return 201 Created', () => {
        expect(response.statusCode).toBe(201);
      });

      test('should return the player information when the user is successfully created', async () => {
        expect(response.body.message).not.toBeDefined();
        expect(response.body.player.playerId).toBeDefined()
        expect(response.body.player.playerName).toBe(playerName)
      });
    });
  });
});
