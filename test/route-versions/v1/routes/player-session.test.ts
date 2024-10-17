import { faker } from '@faker-js/faker';
import { PlayerModel, PlayerSessionModel, types as modelTypes, mongoose } from '@numengames/numinia-models';
import supertest from 'supertest';

import { server } from '../../../../src/server';
import { insertPlayer, insertPlayerSession } from '../../../insert-data-to-model';

const testDatabase = require('../../../test-db')(mongoose);

describe('SessionPlayerRoutes', () => {
  const basePath = '/api/v1/player-session';

  beforeAll(() => testDatabase.connect());

  afterAll(() => testDatabase.close());

  describe('startSession', () => {
    const path = `${basePath}/start`;

    test('missing platform parameter - should return 422 and Boom.badData when required parameter platform is not defined', async () => {
      const res = await supertest(server.app)
        .post(path)
        .send({
          spaceName: faker.lorem.words(3).replace(' ', '-'),
        })
        .expect(422);

      expect(res.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"platform" is required'
      });
    });

    test('missing spaceName parameter - should return 422 and Boom.badData when required parameter spaceName is not defined', async () => {
      const res = await supertest(server.app)
        .post(path)
        .send({
          platform: faker.helpers.arrayElement(['oncyber', 'hyperfy']),
        })
        .expect(422);

      expect(res.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"spaceName" is required'
      });
    });

    test('invalid playerId parameter - should return 422 and Boom.badData when playerId does not match the required pattern', async () => {
      const invalidPlayerId = faker.string.uuid();

      const res = await supertest(server.app)
        .post(path)
        .send({
          playerId: invalidPlayerId,
          spaceName: faker.lorem.words(3).replace(' ', '-'),
          platform: faker.helpers.arrayElement(['oncyber', 'hyperfy']),
        })
        .expect(422);

      expect(res.body.statusCode).toBe(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toContain('"playerId" with value');
      expect(res.body.message).toContain('fails to match the required pattern: /^[0-9a-fA-F]{24}$/');
    });

    describe('anonymous session is registered succesfully', () => {
      let response: supertest.Response;

      const userAgent = faker.internet.userAgent();
      const spaceName = faker.lorem.words(3).replace(' ', '-');
      const platform = faker.helpers.arrayElement(['oncyber', 'hyperfy']);

      beforeAll(async () => {
        response = await supertest(server.app)
          .post(path)
          .send({ userAgent, spaceName, platform });
      });

      afterAll(() => PlayerSessionModel.deleteOne({ _id: response.body.sessionId }));

      test('should return 201 Created', () => {
        expect(response.statusCode).toBe(201);
        expect(response.body.sessionId).toBeDefined();
      });

      test('should have created a new document in the PlayerSession collection with the info', async () => {
        const playerSessionDocument = await PlayerSessionModel.findById(response.body.sessionId);

        expect(playerSessionDocument).toBeDefined();
        expect(playerSessionDocument?.endAt).toBeUndefined();
        expect(playerSessionDocument?.platform).toBe(platform);
        expect(playerSessionDocument?.spaceName).toBe(spaceName);
        expect(playerSessionDocument?.userAgent).toBe(userAgent);
        expect(playerSessionDocument?.startAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.isAnonymous).toBe(true);
        expect(playerSessionDocument?.playerId).toBeUndefined();
      });
    });

    describe('player session is registered succesfully', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;

      const id = faker.string.uuid();
      const userAgent = faker.internet.userAgent();
      const spaceName = faker.lorem.words(3).replace(' ', '-');
      const platform = faker.helpers.arrayElement(['oncyber', 'hyperfy']);

      beforeAll(async () => {
        playerDocument = await insertPlayer({ [`${platform}Id`]: id });

        response = await supertest(server.app)
          .post(path)
          .send({ userAgent, spaceName, platform, playerId: playerDocument._id.toString() });
      });

      afterAll(() => Promise.all([
        PlayerModel.deleteOne({ _id: playerDocument._id }),
        PlayerSessionModel.deleteOne({ _id: response.body.sessionId }),
      ]));

      test('should return 201 Created', () => {
        expect(response.statusCode).toBe(201);
        expect(response.body.sessionId).toBeDefined();
      });

      test('should have created a new document in the PlayerSession collection with the info', async () => {
        const playerSessionDocument = await PlayerSessionModel.findById(response.body.sessionId);

        expect(playerSessionDocument).toBeDefined();
        expect(playerSessionDocument?.endAt).toBeUndefined();
        expect(playerSessionDocument?.platform).toBe(platform);
        expect(playerSessionDocument?.spaceName).toBe(spaceName);
        expect(playerSessionDocument?.userAgent).toBe(userAgent);
        expect(playerSessionDocument?.startAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.isAnonymous).toBe(false);
        expect(playerSessionDocument?.playerId?.toString()).toBe(playerDocument._id.toString());
      });
    });
  });

  describe('endSession', () => {
    const path = `${basePath}/end`;

    test('missing sessionId parameter - should return 422 and Boom.badData when required parameter platform is not defined', async () => {
      const response = await supertest(server.app)
        .post(path)
        .send()
        .expect(422);

      expect(response.body).toEqual({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"sessionId" is required'
      });
    });

    test('invalid sessionId parameter - should return 422 and Boom.badData when sessionId does not match the required pattern', async () => {
      const invalidSessionId = faker.string.uuid();

      const res = await supertest(server.app)
        .post(path)
        .send({ sessionId: invalidSessionId })
        .expect(422);

      expect(res.body.statusCode).toBe(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toContain('"sessionId" with value');
      expect(res.body.message).toContain('fails to match the required pattern: /^[0-9a-fA-F]{24}$/');
    });

    describe('session does not exist', () => {
      let response: supertest.Response;

      beforeAll(async () => {
        response = await supertest(server.app)
          .post(path)
          .send({ sessionId: new mongoose.Types.ObjectId() });
      });

      afterAll(() => PlayerSessionModel.deleteOne({ _id: response.body.sessionId }));

      test('should return 404 Updated', () => {
        expect(response.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Session not found'
        });
      });
    });

    describe('anonymous session is updated succesfully', () => {
      let response: supertest.Response;

      let createdPlayerSessionDocument: modelTypes.PlayerSessionDocument;

      beforeAll(async () => {
        createdPlayerSessionDocument = await insertPlayerSession({ isAnonymous: true });

        response = await supertest(server.app)
          .post(path)
          .send({ sessionId: createdPlayerSessionDocument._id });
      });

      afterAll(() => PlayerSessionModel.deleteOne({ _id: createdPlayerSessionDocument._id }));

      test('should return 204 Updated', () => {
        expect(response.statusCode).toBe(204);
      });

      test('should have created a new document in the PlayerSession collection with the info', async () => {
        const playerSessionDocument = await PlayerSessionModel.findById(createdPlayerSessionDocument._id);

        expect(playerSessionDocument).toBeDefined();
        expect(playerSessionDocument?.endAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.platform).toBe(createdPlayerSessionDocument.platform);
        expect(playerSessionDocument?.spaceName).toBe(createdPlayerSessionDocument.spaceName);
        expect(playerSessionDocument?.userAgent).toBe(createdPlayerSessionDocument.userAgent);
        expect(playerSessionDocument?.startAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.isAnonymous).toBe(true);
        expect(playerSessionDocument?.playerId).toBeUndefined();
      });
    });

    describe('player session is updated succesfully', () => {
      let response: supertest.Response;

      let playerDocument: modelTypes.PlayerDocument;
      let createdPlayerSessionDocument: modelTypes.PlayerSessionDocument;

      beforeAll(async () => {
        playerDocument = await insertPlayer();
        createdPlayerSessionDocument = await insertPlayerSession({ playerId: playerDocument._id, isAnonymous: false });

        response = await supertest(server.app)
          .post(path)
          .send({ sessionId: createdPlayerSessionDocument._id });
      });

      afterAll(() => Promise.all([
        PlayerModel.deleteOne({ _id: playerDocument._id }),
        PlayerSessionModel.deleteOne({ _id: createdPlayerSessionDocument._id }),
      ]));

      test('should return 204 Updated', () => {
        expect(response.statusCode).toBe(204);
      });

      test('should have created a new document in the PlayerSession collection with the info', async () => {
        const playerSessionDocument = await PlayerSessionModel.findById(createdPlayerSessionDocument._id);

        expect(playerSessionDocument).toBeDefined();
        expect(playerSessionDocument?.endAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.platform).toBe(createdPlayerSessionDocument.platform);
        expect(playerSessionDocument?.spaceName).toBe(createdPlayerSessionDocument.spaceName);
        expect(playerSessionDocument?.userAgent).toBe(createdPlayerSessionDocument.userAgent);
        expect(playerSessionDocument?.startAt).toBeInstanceOf(Date);
        expect(playerSessionDocument?.isAnonymous).toBe(false);
        expect(playerSessionDocument?.playerId?.toString()).toBe(playerDocument._id.toString());
      });
    });
  });
});
