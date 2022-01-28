const winston = require('winston')

const debugFormat = winston.format.simple()
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
)

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.DEBUG ? debugFormat : productionFormat,
  transports: [new winston.transports.Console()]
})

module.exports = logger
