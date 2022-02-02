const express = require('express')
const router = express.Router()

const Project = require('../models/project')
const User = require('../models/user')

router.delete('/', async (req, res) => {
  // Find all projects where the user is a member
  const memberProjects = await Project.find({ members: req.user._id })
  // Remove the user from the members list
  for (const project of memberProjects) {
    const idx = project.members.indexOf(req.user._id)
    project.members = project.members.slice(idx, 1)
    await project.save()
  }
  // Delete all projects which the user owns
  await Project.deleteMany({ owner: req.user._id })
  // Finally, delete the user account
  await User.deleteOne({ _id: req.user._id })
  res.status(200).end()
})

module.exports = router
