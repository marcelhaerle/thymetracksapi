require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.use(bodyParser.json())

app.use('/api/register', require('./routes/register'))

module.exports = app
