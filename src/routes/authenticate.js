const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const UserService = require('../service/user-service')
const logger = require('../logger')

router.post(
  '/',
  // Data validation
  check('login').isString().withMessage('Login must be provided'),
  check('password').isString().withMessage('Password must be provided'),
  // --
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const login = req.body.login
    UserService.findByLogin(login)
      .then(user => {
        if (!user) {
          logger.debug(`No user found for login ${login}`)
          return res.status(401).end()
        }
        const password = req.body.password
        if (bcrypt.compareSync(password, user.passwordHash)) {
          const payload = {
            nickname: user.nickname,
            email: user.email
          }
          const token = jwt.sign(payload, process.env.JWT_SECRET)
          return res.json({ token })
        } else {
          console.debug('Invalid password')
          return res.status(401).end()
        }
      })
  })

module.exports = router
