require('dotenv').config()

const security = require('./security')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).end()
})
app.use('/api/health', require('./routes/health'))
app.use('/api/register', require('./routes/register'))
app.use('/api/auth', require('./routes/authenticate'))
app.use('/api/users', security.authenticate, require('./routes/users'))
app.use('/api/projects', security.authenticate, require('./routes/projects'))

module.exports = app
