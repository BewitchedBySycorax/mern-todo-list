/* eslint-disable max-len */
const Task = require('../db/models/task')

module.exports = app => {
  // Create new task
  app.post('/api/tasks', async (req, res) => {
    try {
      const N = 10
      const { _id } = req.user

      if (req.body.title.length <= 10) {
        res.status(400).json({ message: `Task title must be less than or equal to ${N} characters.` })

      } else {
        const task = new Task({ ...req.body, user: _id }) // req.body[user] = _id

        await task.save()

        res.status(201).json(task)
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Read (show) all tasks
  app.get('/api/tasks', async (req, res) => {
    try {
      const { _id } = req.user
      const { page = 1, limit = 5 } = req.query

      const tasks = await Task.find({ user: _id }).skip((page - 1) * limit).limit(limit)

      res.status(200).json(tasks)

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Read custom task
  app.get('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findById(id)

      res.status(200).json(task)

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Update custom task (set/unset completion status)
  app.patch('/api/change-task-completion-status/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findById(id).lean()

      if (!task) {
        res.status(404).send(`Task with specified id ${id} not found`)
      }

      const { completed } = task

      await Task.findOneAndUpdate({ _id: id }, { ...task, completed: !completed })
      const modifiedTask = await Task.findById(id).lean()

      res.status(200).json(modifiedTask)

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Update custom task (completely)
  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findOneAndUpdate({ _id: id }, { $set: req.body })

      res.status(200).json(task)

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Update custom task (fine)
  app.patch('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      const task = await Task.findById(id).lean()
      const modifiedTask = await Task.findOneAndUpdate({ _id: id }, { ...task, ...req.body })

      res.status(200).json(modifiedTask)

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })

  // Delete custom task
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params

      await Task.findOneAndRemove({ _id: id })

      res.status(204).send()

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })
}
