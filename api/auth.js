// ! Need to disable cache in browser (network)
const jwt = require('jsonwebtoken')
const User = require('../db/models/user')

module.exports = app => {
  app.post('/api/auth', async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await User.findOne({ email: username })

      if (!user || !user.validatePassword(password)) {
        return res.status(401).json({ message: 'User unregistred or incorrect password! Please, check it out.' })
      }

      const plainUser = JSON.parse(JSON.stringify(user))
      delete plainUser.password

      res.status(200).json({ ...plainUser, token: jwt.sign(plainUser, '9UwBWnYD') })

    } catch (err) {
      console.error(err.message)
      res.status(500).send(err.message)
    }
  })
}
