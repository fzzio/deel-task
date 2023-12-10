const supertest = require('supertest');
const { Contract } = require('../src/model');
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
    Contract.findAll = jest.fn(() => {
      return {
        id:2,
        terms: 'bla bla bla',
        status: 'in_progress',
        ClientId: 1,
        ContractorId: 6
      };
    });
    const response = await supertest(app)
      .get('/contracts/1')
      .set('profile_id', '2');

    expect(response.status).toBe(403);
  });

  it('should return 500 on server error', async () => {
    Contract.findOne = jest.fn(() => {
      throw new Error();
    });

    const response = await supertest(app)
      .get('/contracts/1')
      .set('profile_id', '1');

    expect(response.status).toBe(500);
  });
});

describe('GET /contracts', () => {
  it('should return a list of contracts if authorized', async () => {
    Contract.findAll = jest.fn(() => {
      return [
        {
          id:1,
          terms: 'bla bla bla',
          status: 'terminated',
          ClientId: 1,
          ContractorId:5
        },
        {
          id:2,
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 6
        }
      ];
    });
    const response = await supertest(app)
      .get('/contracts')
      .set('profile_id', '1');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return an empty array if the user has no contracts', async () => {
    Contract.findAll = jest.fn(() => {
      return [];
    });
    const response = await supertest(app)
      .get('/contracts')
      .set('profile_id', '3');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 500 on server error', async () => {
    Contract.findAll = jest.fn(() => {
      throw new Error();
    });

    const response = await supertest(app)
      .get('/contracts')
      .set('profile_id', '1');

    expect(response.status).toBe(500);
  });
});
