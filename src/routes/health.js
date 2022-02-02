const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  res.json({
    db: mongoose.connection.readyState
  })
})

module.exports = router
