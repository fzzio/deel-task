const supertest = require('supertest');
const app = require('../src/app');

describe('GET /contracts/:id', () => {
  it('should return a contract if authorized', async () => {
    const response = await supertest(app)
      .get('/contracts/1')
      .set('profile_id', '1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status');
  });

  it('should return 404 if contract not found', async () => {
    const response = await supertest(app)
      .get('/contracts/999')
      .set('profile_id', '1');

    expect(response.status).toBe(404);
  });

  it('should return 403 if unauthorized', async () => {
    const response = await supertest(app)
      .get('/contracts/1')
      .set('profile_id', '2');

    expect(response.status).toBe(403);
  });

  it('should return 500 on server error', async () => {
    const { Contract } = require('../src/model');
    Contract.findOne = jest.fn(() => {
      throw new Error();
    });

    const response = await supertest(app)
      .get('/contracts/1')
      .set('profile_id', '1');

    expect(response.status).toBe(500);
  });
});
