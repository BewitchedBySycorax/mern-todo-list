const router = require('express').Router()
const Task = require('../db/models/task')

module.exports = app => {
  router.post('/', async (req, res) => {
    try {
      const { _id } = req.user
      const task = new Task({ ...req.body, user: _id }) // req.body[user] = _id

      await task.save()
      res.redirect('/')

    } catch (e) {
      console.error(e.message)
    }
  })

  router.get('/', async (req, res) => {
    try {
      const { _id } = req.user
      const tasks = await Task.find({ user: _id }).lean()

      res.render('../views/tasks', { tasks, title: 'ToDo List' })

    } catch (e) {
      console.error(e.message)
    }
  })

  router.post('/complete', async (req, res) => {
    try {
      const { id } = req.body

      const task = await Task.findById(id)

      await Task.updateOne({ _id: id }, { completed: !task.completed })

      res.redirect('/')

    } catch (e) {
      console.error(e.message)
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params
      const task = await Task.findById(id)

      res.render('../views/task', task)

    } catch (e) {
      console.error(e.message)
    }
  })

  router.post('/update', async (req, res) => {
    try {
      const { id, title } = req.body

      await Task.updateOne({ _id: id }, { title })

      res.redirect('/tasks')

    } catch (e) {
      console.error(e.message)
    }
  })

  router.post('/remove', async (req, res) => {
    try {
      const { id } = req.body

      await Task.findByIdAndRemove(id)

      res.redirect('/')

    } catch (e) {
      console.error(e.message)
    }
  })

  app.use('/tasks', router)
}
