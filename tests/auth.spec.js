const mongoose = require('mongoose')
const { setupDb } = require('./setup')
const app = require('../src/app')
const request = require('supertest')

describe('Authentication', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await setupDb()
  })

  test('successful login with email', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ login: 'john@gmail.com', password: '12345678' })
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  test('successful login with nickname', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ login: 'johnG', password: '12345678' })
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  test('it should fail when login property is missing', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ email: 'john@gmail.com', password: '12345678' })
    expect(res.statusCode).toBe(400)
  })

  test('it should fail when password property is missing', async () => {
    const res = await request(app)
      .post('/api/auth')
      .send({ login: 'john@gmail.com', secret: '12345678' })
    expect(res.statusCode).toBe(400)
  })
})
