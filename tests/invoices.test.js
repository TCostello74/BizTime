const request = require('supertest');
const app = require('../app');
const db = require('../db');


test('Get list of invoices', async () => {
  const response = await request(app).get('/invoices');
  expect(response.statusCode).toBe(200);
  expect(response.body.invoices).toBeInstanceOf(Array);
});


test('Get a single invoice', async () => {
  const response = await request(app).get('/invoices/1');
  expect(response.statusCode).toBe(200);
  expect(response.body.invoice).toHaveProperty('id');
});

test('Create a new invoice', async () => {
  const response = await request(app)
    .post('/invoices')
    .send({comp_code: 'apple', amt: 500});
  expect(response.statusCode).toBe(201);
  expect(response.body.invoice).toHaveProperty('id');
});

test('Update an invoice', async () => {
  const response = await request(app)
    .put('/invoices/1')
    .send({amt: 600});
  expect(response.statusCode).toBe(200);
  expect(response.body.invoice).toHaveProperty('id');
});

test('Delete an invoice', async () => {
  const response = await request(app).delete('/invoices/1');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({status: 'deleted'});
});

// Close the database connection after all tests have run
afterAll(async () => {
  await db.end();
});
