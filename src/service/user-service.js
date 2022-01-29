const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.findByLogin = async (login) => {
  let user = await User.findOne({ email: login })

  if (!user) {
    user = await User.findOne({ nickname: login })
  }

  return user
}

exports.findUserByEmail = async (email) => {
  return User.findOne({ email: email })
}

exports.findUserByNickname = async (nickname) => {
  return User.findOne({ nickname: nickname })
}

exports.registerUser = async (userDetails) => {
  return new Promise((resolve, reject) => {
    const passwordHash = bcrypt.hashSync(userDetails.password, 12)
    const newUser = User({
      email: userDetails.email,
      nickname: userDetails.nickname,
      passwordHash
    })
    newUser.save(err => {
      if (err) {
        return reject(err)
      }
      resolve(newUser)
    })
  })
}
