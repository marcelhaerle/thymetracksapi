const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

const app = require('../src/app')
const User = require('../src/models/user')

const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

chai.use(chaiHttp)

let mongoServer

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

after(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Register new user', () => {
  describe('POST /api/register', () => {
    it('should create a new user', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi', password: '12345678' })
      expect(res).to.have.status(201)
      const createdUser = await User.findOne({ email: 'max@mustermann.de' }).exec()
      expect(createdUser).to.have.property('email', 'max@mustermann.de')
      expect(createdUser).to.have.property('nickname', 'maxi')
    })

    it('should fail when email is missing', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ nickname: 'maxi', password: '12345678' })
      expect(res).to.have.status(400)
    })

    it('should fail when nickname is missing', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', password: '12345678' })
      expect(res).to.have.status(400)
    })

    it('should fail when password is missing', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi' })
      expect(res).to.have.status(400)
    })

    it('should fail when password too short', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ email: 'max@mustermann.de', nickname: 'maxi', password: '1234' })
      expect(res).to.have.status(400)
    })

    it('should fail when email is not valid', async () => {
      const res = await chai.request(app)
        .post('/api/register')
        .send({ email: 'mustermann.de', nickname: 'maxi', password: '123477887' })
      expect(res).to.have.status(400)
    })
  })
})
