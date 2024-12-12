import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const epicResultTemplate = {
  title: 'e2e',
  description: '',
  status: 't',
  category: 'e',
  points: null,
  parentId: null,
  id: expect.any(Number),
  created_date: expect.any(String),
  updated_date: expect.any(String),
};

const storyResultTemplate = {
  title: 'e2e',
  description: '',
  status: 'd',
  category: 's',
  points: 3,
  id: expect.any(Number),
  created_date: expect.any(String),
  updated_date: expect.any(String),
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Issue tracker', () => {
    let epicIssueId = null;
    let storyIssueId = null;

    it('adds an epic', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e', category: 'e' })
        .expect(201);

      epicIssueId = result.body.id; //stored for other tests

      expect(result.body).toEqual(epicResultTemplate);
    });

    it('reads an epic', async () => {
      const result = await request(app.getHttpServer())
        .get(`/tracker/${epicIssueId}`)
        .expect(200);

      expect(result.body).toEqual(epicResultTemplate);
    });

    it('fails - no category', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e' })
        .expect(400);

      expect(result.body.message).toEqual([
        'category must be one of the following values: e, s, t',
      ]);
    });

    it('fails - wrong category', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e', category: 'a' })
        .expect(400);

      expect(result.body.message).toEqual([
        'category must be one of the following values: e, s, t',
      ]);
    });

    it('fails - negative points', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e', category: 's', points: -5 })
        .expect(400);

      expect(result.body.message).toEqual(['points must not be less than 0']);
    });

    it('fails - story without epic parent', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e', category: 's' })
        .expect(400);

      expect(result.body.message).toEqual('Stories must belong to an Epic');
    });

    it('adds a story', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({
          title: 'e2e',
          category: 's',
          status: 'd',
          points: 3,
          parentId: epicIssueId,
        })
        .expect(201);

      storyIssueId = result.body.id; //stored for other tests
      expect(result.body).toEqual({
        ...storyResultTemplate,
        parentId: epicIssueId,
      });
    });

    it('adds a task', async () => {
      const result = await request(app.getHttpServer())
        .post('/tracker')
        .send({ title: 'e2e', category: 't', parentId: storyIssueId })
        .expect(201);

      expect(result.body).toEqual({
        ...epicResultTemplate,
        category: 't',
        parentId: storyIssueId,
      });
    });

    it('updates a task', async () => {
      const result = await request(app.getHttpServer())
        .patch(`/tracker/${epicIssueId}`)
        .send({ title: 'e2e-updated' })
        .expect(200);

      expect(result.body).toEqual({
        title: 'e2e-updated',
        description: '',
        status: 't',
        category: 'e',
        points: null,
        parentId: null,
        id: epicIssueId,
        updated_date: expect.any(String),
      });
    });

    it('update - fails', async () => {
      const result = await request(app.getHttpServer())
        .patch(`/tracker/${epicIssueId}`)
        .send({ title: 'e2e', status: 'd' })
        .expect(400);

      expect(result.body.message).toEqual('Illegal status transition');
    });

    it('reads all tickets', async () => {
      const result = await request(app.getHttpServer())
        .get(`/tracker/`)
        .expect(200);

      expect(result.body).toEqual(expect.any(Array));
    });

    it('deletes a task', async () => {
      const result = await request(app.getHttpServer())
        .delete(`/tracker/${storyIssueId}`)
        .expect(200);

      expect(result.body).toEqual({ affected: 1, raw: [] });
    });
  });
});
