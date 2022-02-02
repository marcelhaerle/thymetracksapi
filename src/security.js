const jwt = require('jsonwebtoken')

const UserService = require('./service/user-service')
const logger = require('./logger')

exports.authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (!authHeader) {
    return res.status(401).end()
  }

  const token = authHeader.substring(7)
  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET)
    UserService.findUserByEmail(jwtPayload.email)
      .then(user => {
        if (user) {
          req.user = user
          return next()
        } else {
          return res.status(401).end()
        }
      })
      .catch(e => {
        return next(e, false)
      })
  } catch (err) {
    logger.info(`Invalid token ${token}`, err)
    return res.status(401).end()
  }
}
