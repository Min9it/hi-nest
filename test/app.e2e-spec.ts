import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let reqSev: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    reqSev = request(app.getHttpServer());

    await app.init();
  });

  it('/ (GET)', () => {
    return reqSev
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Welcome to my Movie API');
  });

  describe('/movies', () => {
    it('GET', () => {
      return reqSev.get('/movies').expect(HttpStatus.OK).expect([]);
    });

    it('POST 201', () => {
      return reqSev
        .post('/movies')
        .send({ title: 'testTitle', year: 2000, genres: ['test'] })
        .expect(HttpStatus.CREATED);
    });

    it('POST 400', () => {
      return reqSev
        .post('/movies')
        .send({
          title: 'testTitle',
          year: 2000,
          genres: ['test'],
          other: 'thing',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('DELETE', () => {
      return reqSev.delete('/movies').expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return reqSev.get('/movies/1').expect(HttpStatus.OK);
    });

    it('GET 404', () => {
      return reqSev.get('/movies/999').expect(HttpStatus.NOT_FOUND);
    });
    it('PATCH 200', () => {
      return reqSev
        .patch('/movies/1')
        .send({ title: 'updatedTest' })
        .expect(HttpStatus.OK);
    });

    it('DELETE 200', () => {
      return reqSev.delete('/movies/1').expect(HttpStatus.OK);
    });
  });
});
