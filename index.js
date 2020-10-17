/* eslint-disable no-unused-expressions */
const auth = require('./api/auth')
const register = require('./api/register')
const tasks = require('./api/tasks')

module.exports = app => {
  auth(app)
  register(app)
  tasks(app)
}
