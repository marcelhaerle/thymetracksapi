require('dotenv').config()

const logger = require('./logger')
const gracefulShutdown = require('http-graceful-shutdown')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

const { connectDb } = require('./models')

const PORT = process.env.PORT || 4040

app.use(bodyParser.json())
app.use('/', require('./routes/health'))
app.use('/api', require('./routes/register'))

connectDb()
  .then(async () => {
    logger.info('Connected to MongoDB...')
    const server = app.listen(PORT, () => {
      logger.info(`Server listening on ${PORT}`)
    })
    gracefulShutdown(server)
  })
  .catch(e => {
    logger.error(`Failed to connect to MongoDB ${process.env.DATABASE_URL}`)
    process.exit()
  })
