import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { like } from 'pactum-matchers';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3001);

    // prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(() => {
    app.close();
  });

  describe('User', () => {
    it('Create a common user', () => {
      return pactum
        .spec()
        .post('/user')
        .withBody({
          email: 'mary@example.com',
          name: 'Mary Doe',
          hash: '123',
          type: 'common',
          cpf: '545.214.090-59',
          balance: 500,
        })
        .expectStatus(201)
        .expectJsonMatchStrict({
          id: 1,
          name: 'Mary Doe',
        });
    });

    it('Create a shopkeeper user', () => {
      return pactum
        .spec()
        .post('/user')
        .withBody({
          email: 'john@example.com',
          name: 'John Doe',
          hash: '123',
          type: 'shopkeeper',
          cnpj: '66.166.434/0001-74',
          balance: 533,
        })
        .expectStatus(201)
        .expectJsonMatchStrict({
          id: 2,
          name: 'John Doe',
        });
    });

    it('Try to create a shopkeeper with a bad cnpj', () => {
      return pactum
        .spec()
        .post('/user')
        .withBody({
          email: 'john@example.com',
          name: 'John Doe',
          hash: '123',
          type: 'shopkeeper',
          cnpj: '66.166.434/0001-75',
          balance: 500,
        })
        .expectStatus(400)
        .expectJsonMatchStrict({
          message: ['cnpj must be valid.'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('Try to create a repeated user', () => {
      return pactum
        .spec()
        .post('/user')
        .withBody({
          email: 'john@example.com',
          name: 'John Doe',
          hash: '123',
          type: 'shopkeeper',
          cnpj: '66.166.434/0001-74',
          balance: 500,
        })
        .expectStatus(400)
        .expectJsonMatchStrict({
          message: ['cnpj must be unique.'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });

  describe('Transfer', () => {
    it('Create a successful transfer', () => {
      return pactum
        .spec()
        .post('/transfer')
        .withBody({
          creditorId: 1,
          debitorId: 2,
          amount: 5,
        })
        .expectStatus(201)
        .expectJsonMatchStrict({
          id: like(5),
          createdAt: like('2024-05-21T03:21:48.681Z'),
          creditorId: 1,
          debitorId: 2,
          amount: '5',
        });
    });

    it('Try a bad debitorId transfer', () => {
      return pactum
        .spec()
        .post('/transfer')
        .withBody({
          creditorId: 1,
          debitorId: 42,
          amount: 5,
        })
        .expectStatus(400)
        .expectBody({
          error: 'Bad Request',
          message: ['debitorId not found.'],
          statusCode: 400,
        });
    });

    it('Try a bad creditorId transfer', () => {
      return pactum
        .spec()
        .post('/transfer')
        .withBody({
          creditorId: 42,
          debitorId: 2,
          amount: 5,
        })
        .expectStatus(400)
        .expectBody({
          message: ['creditorId not found.'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('Try a bad creditorId transfer', () => {
      return pactum
        .spec()
        .post('/transfer')
        .withBody({
          creditorId: 1,
          debitorId: 2,
          amount: 5555,
        })
        .expectStatus(400)
        .expectBody({
          message: ['amount is too high.'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('Try a transfer as a shopkeeper being the creditor', () => {
      return pactum
        .spec()
        .post('/transfer')
        .withBody({
          creditorId: 2,
          debitorId: 1,
          amount: 101,
        })
        .expectStatus(400)
        .expectBody({
          message: ['creditorId is a shopkeeper.'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });
});
