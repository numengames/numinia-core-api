import supertest from 'supertest';
import {
  types,
  mongoose,
  UserModel,
  GameModel,
  GameScoreModel,
} from '@numengames/numinia-models';
import { faker } from '@faker-js/faker';

import { server } from '../../../../src/server';
import { insertGame, insertUser } from '../../../insert-data-to-model';

const testDatabase = require('../../../test-db')(mongoose);

describe('GameRoutes', () => {
  const basePath = '/api/v1';

  beforeAll(() => testDatabase.connect());

  afterAll(() => testDatabase.close());

  describe('POST /score', () => {
    const path = `${basePath}/score`;

    test('when no params provided, it should response an error with status code 422', async () => {
      await supertest(server.app).post(path).expect(422);
    });

    test('when the score param is missing, it should response an error with status code 422', async () => {
      await supertest(server.app)
        .post(path)
        .send({
          name: faker.word.words(),
          walletId: faker.finance.ethereumAddress(),
          timer: faker.number.int({ min: 1, max: 1000 }),
        })
        .expect(422);
    });

    test('when the timer param is missing, it should response an error with status code 422', async () => {
      await supertest(server.app)
        .post(path)
        .send({
          name: faker.word.words(),
          walletId: faker.finance.ethereumAddress(),
          score: faker.number.int({ min: 1, max: 30 }),
        })
        .expect(422);
    });

    test('when the name param is missing, it should response an error with status code 422', async () => {
      await supertest(server.app)
        .post(path)
        .send({
          walletId: faker.finance.ethereumAddress(),
          score: faker.number.int({ min: 1, max: 30 }),
          timer: faker.number.int({ min: 1, max: 1000 }),
        })
        .expect(422);
    });

    describe('when the game does not exist in the database', () => {
      let response: supertest.Response;

      const params = {
        name: `${faker.word.words()}-test`,
        walletId: faker.finance.ethereumAddress(),
        score: faker.number.int({ min: 1, max: 30 }),
        timer: faker.number.int({ min: 1, max: 1000 }),
      };

      beforeAll(async () => {
        await Promise.all([
          insertGame(),
          insertUser({ wallet: params.walletId }),
        ]);
        response = await supertest(server.app).post(path).send(params);
      });

      afterAll(() => UserModel.deleteOne({ wallet: params.walletId }));

      test('it should response a statusCode of 404 - Not found', () => {
        expect(response.statusCode).toBe(404);
      });
    });

    describe('when the conversation with assistant has been created', () => {
      let response: supertest.Response;

      const params = {
        name: faker.word.words(),
        walletId: faker.finance.ethereumAddress(),
        score: faker.number.int({ min: 1, max: 30 }),
        timer: faker.number.int({ min: 1, max: 1000 }),
      };

      beforeAll(async () => {
        await Promise.all([
          insertUser({ wallet: params.walletId }),
          insertGame({ name: params.name, isActive: true }),
        ]);
        response = await supertest(server.app).post(path).send(params);
      });

      afterAll(() =>
        Promise.all([
          GameModel.deleteOne({ name: params.name }),
          UserModel.deleteOne({ wallet: params.walletId }),
        ]),
      );

      test('it should response a statusCode of 201 - Created', () => {
        expect(response.statusCode).toBe(201);
      });

      test('it should have a game document with all the params defined', async () => {
        const gameDocument = <types.GameDocument>(
          await GameModel.findOne({ name: params.name })
        );

        expect(gameDocument._id).toBeDefined();
        expect(gameDocument.mode).toBeDefined();
        expect(gameDocument.origin).toBeDefined();
        expect(gameDocument.isActive).toBeTruthy();
        expect(gameDocument.name).toBe(params.name);
        expect(gameDocument.createdAt).toBeDefined();
        expect(gameDocument.updatedAt).toBeDefined();
        expect(gameDocument.difficulty).toBeDefined();
        expect(gameDocument.averageTime).toBeDefined();
      });

      test('it should have a user document with all the params defined', async () => {
        const userDocument = <types.UserDocument>(
          await UserModel.findOne({ wallet: params.walletId })
        );

        expect(userDocument._id).toBeDefined();
        expect(userDocument.userName).toBeDefined();
        expect(userDocument.isBlocked).toBeDefined();
        expect(userDocument.isActive).toBeDefined();
        expect(userDocument.wallet).toBe(params.walletId);
        expect(userDocument.createdAt).toBeDefined();
        expect(userDocument.updatedAt).toBeDefined();
        expect(userDocument.lastConectionDate).toBeDefined();
        expect(userDocument.accounts).toHaveLength(1);
        expect(userDocument.accounts[0].accountId).toBeDefined();
        expect(userDocument.accounts[0].kind).toBeDefined();
      });

      test('it should have created a game score document with all the params defined', async () => {
        const gameDocument = <types.GameDocument>(
          await GameModel.findOne({ name: params.name })
        );

        const userDocument = <types.UserDocument>(
          await UserModel.findOne({ wallet: params.walletId })
        );

        const gameScoreDocument = <types.GameScoreDocument>(
          await GameScoreModel.findOne({
            user: userDocument._id,
            game: gameDocument._id,
          })
        );

        expect(gameScoreDocument._id).toBeDefined();
        expect(gameScoreDocument.score).toBe(params.score);
        expect(gameScoreDocument.timer).toBe(params.timer);
        expect(gameScoreDocument.createdAt).toBeDefined();
        expect(gameScoreDocument.updatedAt).toBeDefined();
        expect(gameScoreDocument.game.toString()).toBe(
          gameDocument._id.toString(),
        );
        expect(gameScoreDocument.user?.toString()).toBe(
          userDocument._id.toString(),
        );
      });
    });
  });
});
