const supertest = require('supertest');
const { Job, Contract, sequelize } = require('../src/model');
const app = require('../src/app');

describe('GET /jobs/unpaid', () => {
  it('should return unpaid jobs for an authorized user', async () => {
    Job.findAll = jest.fn(() => {
      return [
        {
          "id": 3,
          "description": "work",
          "price": 202,
          "paid": null,
          "paymentDate": null,
          "createdAt": "2023-12-10T22:32:40.685Z",
          "updatedAt": "2023-12-10T22:32:40.685Z",
          "ContractId": 3,
          "Contract": {
              "id": 3,
              "terms": "bla bla bla",
              "status": "in_progress",
              "createdAt": "2023-12-10T22:32:40.684Z",
              "updatedAt": "2023-12-10T22:32:40.684Z",
              "ContractorId": 6,
              "ClientId": 2
          }
        }
      ];
    });

    const response = await supertest(app)
      .get('/jobs/unpaid')
      .set('profile_id', 2);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should return an empty array for unpaid jobs from an authorized user', async () => {
    Job.findAll = jest.fn(() => {
      return [];
    });

    const response = await supertest(app)
      .get('/jobs/unpaid')
      .set('profile_id', 2);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it('should return 401 if unauthorized', async () => {
    const response = await supertest(app)
      .get('/jobs/unpaid')
      .set('profile_id', 'invalid-profile-id');

    expect(response.status).toBe(401);
  });

  it('should return 500 on server error', async () => {
    Job.findAll = jest.fn(() => {
      throw new Error('Mocked error');
    });

    const response = await supertest(app)
      .get('/jobs/unpaid')
      .set('profile_id', '1');

    expect(response.status).toBe(500);
  });
});
