const logger = require('../logger')
const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const UserService = require('../service/user-service')

router.post(
  '/',
  // Data validation
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('email').custom(email => {
    return UserService.findUserByEmail(email).then(user => {
      if (user) {
        return Promise.reject(Error('E-mail already in use'))
      }
    })
  }),
  check('nickname').isString().withMessage('Nickname must be provided'),
  check('nickname').custom(nickname => {
    return UserService.findUserByNickname(nickname).then(user => {
      if (user) {
        return Promise.reject(Error('Nickname already in use'))
      }
    })
  }),
  check('password').isLength({ min: 8 }).withMessage('Password is too short'),
  // --
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    UserService.registerUser(req.body)
      .then(newUser => {
        logger.debug(`Registered new user ${newUser}`)
        res.status(201).end()
      })
      .catch(e => {
        res.status(400).json({ message: e.message })
      })
  })

module.exports = router
