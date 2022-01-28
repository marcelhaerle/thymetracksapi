const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  nickname: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.static.findByLogin = async (login) => {
  let user = await this.findOne({ email: login })

  if (!user) {
    user = await this.findOne({ nickname: login })
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
