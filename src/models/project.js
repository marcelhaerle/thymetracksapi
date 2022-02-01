const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  members: [mongoose.Schema.Types.ObjectId]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
