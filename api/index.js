/* eslint-disable no-unused-expressions */
const auth = require('./auth')
const register = require('./register')
const tasks = require('./tasks')

module.exports = app => {
  auth(app)
  register(app)
  tasks(app)
}
