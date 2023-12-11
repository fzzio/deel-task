const supertest = require('supertest');
const { Job } = require('../src/model');
const app = require('../src/app');

describe('GET /admin/best-profession', () => {
  it('should return the best profession if authorized', async () => {
    const response = await supertest(app)
      .get('/admin/best-profession')
      .set('profile_id', '1')
      .query({ start: '2019-01-01', end: '2021-01-01' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('profession');
  });

  it('should return 400 if start or end parameters are missing', async () => {
    const response = await supertest(app)
      .get('/admin/best-profession')
      .set('profile_id', '1')
      .query({ start: '2019-01-01' });

    expect(response.status).toBe(400);
  });

  it('should return 500 on server error', async () => {
    Job.findAll = jest.fn(() => {
      throw new Error();
    });

    const response = await supertest(app)
      .get('/admin/best-profession')
      .set('profile_id', '1')
      .query({ start: '2019-01-01', end: '2021-01-01' });

    expect(response.status).toBe(500);
  });
});

describe('GET /admin/best-clients', () => {
  it('should return 400 if start or end parameters are missing', async () => {
    const response = await supertest(app)
      .get('/admin/best-clients')
      .set('profile_id', '1')
      .query({ start: '2019-01-01' });

    expect(response.status).toBe(400);
  });

  it('should return 500 on server error', async () => {
    Job.findAll = jest.fn(() => {
      throw new Error();
    });

    const response = await supertest(app)
      .get('/admin/best-clients')
      .set('profile_id', '1')
      .query({ start: '2019-01-01', end: '2021-01-01', limit: 2 });

    expect(response.status).toBe(500);
  });
});
