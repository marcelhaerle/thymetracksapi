const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const logger = require('../logger')
const Project = require('../models/project')
const User = require('../models/user')

router.get(
  '/',
  (req, res) => {
    const userId = req.user._id
    Project.find({ $or: [{ owner: userId }, { members: userId }] }, (err, result) => {
      if (err) {
        logger.error('Failed to find projects by userId', err)
        return res.status(500).end()
      }
      const dtos = result.map(project => {
        return {
          id: project._id.toString(),
          title: project.title
        }
      })
      res.json(dtos)
    })
  }
)

router.post(
  '/',
  check('title').isString().withMessage('Title must be provided'),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const project = new Project({ title: req.body.title, owner: req.user._id, members: [] })
    project.save(err => {
      if (err) {
        logger.error('Failed to save new project', err)
        return res.status(500).end()
      }
      res.status(201).header('Location', `/api/projects/${project._id.toString()}`).end()
    })
  }
)

router.get(
  '/:id',
  async (req, res) => {
    const projectId = req.params.id
    if (projectId.length !== 24) {
      return res.status(404).end()
    }
    const userId = req.user._id
    const project = await Project.findOne({ $and: [{ _id: projectId }, { $or: [{ owner: userId }, { members: userId }] }] }).exec()
    if (!project) {
      return res.status(404).end()
    }

    const dto = { id: project._id.toString(), title: project.title }
    const owner = await User.findById(project.owner).exec()
    const members = []
    for (const memberId of project.members) {
      const member = await User.findById(memberId).exec()
      members.push({ id: member._id.toString(), email: member.email, nickname: member.nickname })
    }
    dto.owner = { id: owner._id.toString(), email: owner.email, nickname: owner.nickname }
    dto.members = members
    return res.json(dto)
  }
)

router.delete(
  '/:id',
  async (req, res) => {
    const projectId = req.params.id
    if (projectId.length !== 24) {
      return res.status(404).end()
    }
    const userId = req.user._id
    const project = await Project.findOne({ $and: [{ _id: projectId }, { $or: [{ owner: userId }, { members: userId }] }] }).exec()
    if (!project) {
      return res.status(404).end()
    }

    await project.delete()
    res.status(200).end()
  }
)

module.exports = router
