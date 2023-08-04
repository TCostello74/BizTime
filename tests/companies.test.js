const request = require('supertest');
const app = require('../app');  // This is your express app
const db = require('../db');    // Import your database instance


test('Get list of companies', async () => {
  const response = await request(app).get('/companies');
  expect(response.statusCode).toBe(200);
  expect(response.body.companies).toBeInstanceOf(Array);
});


test('Get a single company', async () => {
  const response = await request(app).get('/companies/apple');
  expect(response.statusCode).toBe(200);
  expect(response.body.company).toHaveProperty('code');
});


test('Create a new company', async () => {
  const response = await request(app)
    .post('/companies')
    .send({name: 'New Company', description: 'This is a new company.'});
  
  expect(response.statusCode).toBe(201);
  expect(response.body.company).toHaveProperty('code');
});


test('Update a company', async () => {
  const response = await request(app)
    .put('/companies/apple')
    .send({name: 'Updated Company', description: 'This is an updated description.'});
  
  expect(response.statusCode).toBe(200);
  expect(response.body.company).toHaveProperty('code');
});


test('Delete a company', async () => {
  const response = await request(app).delete('/companies/apple');
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({status: 'deleted'});
});

// Close the database connection after all tests have run
afterAll(async () => {
  await db.end();
});
