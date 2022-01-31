const User = require('../src/models/user')

exports.setupDb = async () => {
  await User.deleteMany({})
  await User.create({ email: 'john@gmail.com', nickname: 'johnG', passwordHash: '$2a$12$CWffg66UtFT62LAXeWSZKugwPJUPibuOvYQKQyAZkRk3NRt2WiO4i' }) // password = 12345678
}
