import { faker } from '@faker-js/faker';
import {
  types,
  mongoose,
  GameModel,
  PlayerModel,
  GameScoreModel,
  interfaces as modelInterfaces,
} from '@numengames/numinia-models';
import supertest from 'supertest';

import { server } from '../../../../src/server';
import { insertGame, insertPlayer } from '../../../insert-data-to-model';

const testDatabase = require('../../../test-db')(mongoose);

describe.skip('GameRoutes', () => {
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

    // describe('when the game does not exist in the database', () => {
    //   let response: supertest.Response;

    //   const params = {
    //     name: `${faker.word.words()}-test`,
    //     walletId: faker.finance.ethereumAddress(),
    //     score: faker.number.int({ min: 1, max: 30 }),
    //     timer: faker.number.int({ min: 1, max: 1000 }),
    //   };

    //   beforeAll(async () => {
    //     await Promise.all([insertGame(), insertPlayer({ walletId: params.walletId })]);
    //     response = await supertest(server.app).post(path).send(params);
    //   });

    //   afterAll(() => PlayerModel.deleteOne({ walletId: params.walletId }));

    //   test('it should response a statusCode of 404 - Not found', () => {
    //     expect(response.statusCode).toBe(404);
    //   });
    // });

    // describe('when the conversation with assistant has been created but the player has no wallet', () => {
    //   let response: supertest.Response;

    //   let playerDocument: modelInterfaces.PlayerAttributes;

    //   const params = {
    //     name: faker.word.words(),
    //     score: faker.number.int({ min: 1, max: 30 }),
    //     timer: faker.number.int({ min: 1, max: 1000 }),
    //   };

    //   beforeAll(async () => {
    //     playerDocument = await insertPlayer({ walletId: undefined });
    //     await insertGame({ name: params.name, isActive: true });
    //     response = await supertest(server.app).post(path).send(params);
    //   });

    //   afterAll(() =>
    //     Promise.all([
    //       GameModel.deleteOne({ name: params.name }),
    //       PlayerModel.deleteOne({ _id: playerDocument._id }),
    //     ]),
    //   );

    //   test('it should response a statusCode of 201 - Created', () => {
    //     expect(response.statusCode).toBe(201);
    //   });

    //   test('it should have a game document with all the params defined', async () => {
    //     const gameDocument = <types.GameDocument>await GameModel.findOne({ name: params.name });

    //     expect(gameDocument._id).toBeDefined();
    //     expect(gameDocument.mode).toBeDefined();
    //     expect(gameDocument.origin).toBeDefined();
    //     expect(gameDocument.isActive).toBeTruthy();
    //     expect(gameDocument.name).toBe(params.name);
    //     expect(gameDocument.createdAt).toBeDefined();
    //     expect(gameDocument.updatedAt).toBeDefined();
    //     expect(gameDocument.difficulty).toBeDefined();
    //     expect(gameDocument.averageTime).toBeDefined();
    //   });

    //   test('it should have a player document with all the params defined', async () => {
    //     const document = <types.PlayerDocument>await PlayerModel.findById(playerDocument._id);

    //     expect(document._id).toBeDefined();
    //     expect(document.userName).toBeDefined();
    //     expect(document.isBlocked).toBeDefined();
    //     expect(document.isActive).toBeDefined();
    //     expect(document.walletId).not.toBeDefined();
    //     expect(document.createdAt).toBeDefined();
    //     expect(document.updatedAt).toBeDefined();
    //     expect(document.lastConectionDate).toBeDefined();
    //     expect(document.accounts).toHaveLength(1);
    //     expect(document.accounts[0].accountId).toBeDefined();
    //     expect(document.accounts[0].kind).toBeDefined();
    //   });

    //   test('it should have created a game score document with all the params defined', async () => {
    //     const gameDocument = <types.GameDocument>await GameModel.findOne({ name: params.name });

    //     const document = <types.PlayerDocument>await PlayerModel.findById(playerDocument._id);

    //     const gameScoreDocument = await GameScoreModel.findOne({
    //       player: playerDocument._id,
    //       game: gameDocument._id,
    //     });

    //     expect(gameScoreDocument?._id).toBeDefined();
    //     expect(gameScoreDocument?.score).toBe(params.score);
    //     expect(gameScoreDocument?.timer).toBe(params.timer);
    //     expect(gameScoreDocument?.createdAt).toBeDefined();
    //     expect(gameScoreDocument?.updatedAt).toBeDefined();
    //     expect(gameScoreDocument?.game.toString()).toBe(gameDocument._id.toString());
    //     expect(gameScoreDocument?.player?.toString()).toBe(document._id.toString());
    //   });
    // });

    // describe('when the conversation with assistant has been created', () => {
    //   let response: supertest.Response;

    //   const params = {
    //     name: faker.word.words(),
    //     walletId: faker.finance.ethereumAddress(),
    //     score: faker.number.int({ min: 1, max: 30 }),
    //     timer: faker.number.int({ min: 1, max: 1000 }),
    //   };

    //   beforeAll(async () => {
    //     await Promise.all([
    //       insertPlayer({ walletId: params.walletId }),
    //       insertGame({ name: params.name, isActive: true }),
    //     ]);
    //     response = await supertest(server.app).post(path).send(params);
    //   });

    //   afterAll(() =>
    //     Promise.all([
    //       GameModel.deleteOne({ name: params.name }),
    //       PlayerModel.deleteOne({ walletId: params.walletId }),
    //     ]),
    //   );

    //   test('it should response a statusCode of 201 - Created', () => {
    //     expect(response.statusCode).toBe(201);
    //   });

    //   test('it should have a game document with all the params defined', async () => {
    //     const gameDocument = <types.GameDocument>await GameModel.findOne({ name: params.name });

    //     expect(gameDocument._id).toBeDefined();
    //     expect(gameDocument.mode).toBeDefined();
    //     expect(gameDocument.origin).toBeDefined();
    //     expect(gameDocument.isActive).toBeTruthy();
    //     expect(gameDocument.name).toBe(params.name);
    //     expect(gameDocument.createdAt).toBeDefined();
    //     expect(gameDocument.updatedAt).toBeDefined();
    //     expect(gameDocument.difficulty).toBeDefined();
    //     expect(gameDocument.averageTime).toBeDefined();
    //   });

    //   test('it should have a player document with all the params defined', async () => {
    //     const playerDocument = <types.PlayerDocument>await PlayerModel.findOne({ walletId: params.walletId });

    //     expect(playerDocument._id).toBeDefined();
    //     expect(playerDocument.userName).toBeDefined();
    //     expect(playerDocument.isBlocked).toBeDefined();
    //     expect(playerDocument.isActive).toBeDefined();
    //     expect(playerDocument.walletId).toBe(params.walletId);
    //     expect(playerDocument.createdAt).toBeDefined();
    //     expect(playerDocument.updatedAt).toBeDefined();
    //     expect(playerDocument.lastConectionDate).toBeDefined();
    //     expect(playerDocument.accounts).toHaveLength(1);
    //     expect(playerDocument.accounts[0].accountId).toBeDefined();
    //     expect(playerDocument.accounts[0].kind).toBeDefined();
    //   });

    //   test('it should have created a game score document with all the params defined', async () => {
    //     const gameDocument = <types.GameDocument>await GameModel.findOne({ name: params.name });

    //     const playerDocument = <types.PlayerDocument>await PlayerModel.findOne({ walletId: params.walletId });

    //     const gameScoreDocument = <types.GameScoreDocument>await GameScoreModel.findOne({
    //       game: gameDocument._id,
    //       player: playerDocument._id,
    //     });

    //     expect(gameScoreDocument._id).toBeDefined();
    //     expect(gameScoreDocument.score).toBe(params.score);
    //     expect(gameScoreDocument.timer).toBe(params.timer);
    //     expect(gameScoreDocument.createdAt).toBeDefined();
    //     expect(gameScoreDocument.updatedAt).toBeDefined();
    //     expect(gameScoreDocument.game.toString()).toBe(gameDocument._id.toString());
    //     expect(gameScoreDocument.player?.toString()).toBe(playerDocument._id.toString());
    //   });
    // });
  });
});
