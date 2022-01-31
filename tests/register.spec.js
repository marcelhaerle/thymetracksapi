const mongoose = require('mongoose')
const { setupDb } = require('./setup')
const app = require('../src/app')
const request = require('supertest')

const User = require('../src/models/user')

describe('Register new user', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await setupDb()
  })

  describe('POST /api/register', () => {
    test('it should create a new user', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi', password: '12345678' })
      expect(res.statusCode).toBe(201)
      const createdUser = await User.findOne({ email: 'max@mustermann.de' }).exec()
      expect(createdUser.email).toBe('max@mustermann.de')
      expect(createdUser.nickname).toBe('maxi')
    })

    test('it should fail when email already in use', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'john@gmail.com', nickname: 'jonnyy', passwordHash: '1234567890' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when nickname already in use', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'john2@gmail.com', nickname: 'johnG', passwordHash: '1234567890' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when email is missing', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ nickname: 'maxi', password: '12345678' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when nickname is missing', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', password: '12345678' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when password is missing', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when password too short', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi', password: '1234' })
      expect(res.statusCode).toBe(400)
    })

    test('it should fail when email is not valid', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'mustermann.de', nickname: 'maxi', password: '123477887' })
      expect(res.statusCode).toBe(400)
    })
  })
})
