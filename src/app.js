require('dotenv').config()

const gracefulShutdown = require('http-graceful-shutdown')
const express = require('express')
const app = express()

const { connectDb } = require('./models')

const PORT = process.env.PORT || 4040

app.use('/', require('./routes/health'))

connectDb()
  .then(async () => {
    console.log('Connected to MongoDB...')
    const server = app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`)
    })
    gracefulShutdown(server)
  })
  .catch(e => {
    console.error('Failed to connect to MongoDB')
    process.exit()
  })
