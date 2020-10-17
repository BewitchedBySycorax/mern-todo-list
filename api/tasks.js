/* eslint-disable max-len */
const Task = require('../db/models/task')

module.exports = app => {
  // Create new task
  app.post('/api/tasks', async (req, res) => {
    try {
      const { _id } = req.user

      const task = new Task({ ...req.body, user: _id }) // req.body[user] = _id

      await task.save()

      res.status(201).json(task)

    } catch (e) {
      console.error(e.message)
    }
  })

  // Read (show) all tasks
  app.get('/api/tasks', async (req, res) => {
    try {
      const { _id } = req.user
      const { page = 1, limit = 5 } = req.query

      const tasks = await Task.find({ user: _id }).skip((page - 1) * limit).limit(limit)

      res.status(200).json(tasks)

    } catch (e) {
      console.error(e.message)
    }
  })

  // Read custom task
  app.get('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findById(id)

      res.status(200).json(task)

    } catch (e) {
      console.error(e.message)
    }
  })

  // Update custom task (completely)
  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findOneAndUpdate({ _id: id }, { $set: req.body })

      res.status(200).json(task)

    } catch (e) {
      console.error(e.message)
    }
  })

  // Update custom task (fine)
  app.patch('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findById(id).lean()
      const modifiedTask = await Task.findOneAndUpdate({ _id: id }, { ...task, ...req.body })

      res.status(200).json(modifiedTask)

    } catch (e) {
      console.error(e.message)
    }
  })

  // Delete custom task
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      await Task.findOneAndRemove({ _id: id })

      res.status(204).send()

    } catch (e) {
      console.error(e.message)
    }
  })
}
