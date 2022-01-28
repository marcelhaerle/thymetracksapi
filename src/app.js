require('dotenv').config()

const express = require('express')
const app = express()

const { connectDb } = require('./models')

const PORT = process.env.PORT || 4040

app.use('/', require('./routes/health'))

connectDb()
  .then(async () => {
    console.log('Connected to MongoDB...')
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`)
    })
  })
  .catch(e => {
    console.error('Failed to connect to MongoDB')
    process.exit()
  })
