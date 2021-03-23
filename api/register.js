const User = require('../db/models/user')

module.exports = app => {
  app.post('/api/register', async (req, res) => {
    try {
      const { repassword, ...restBody } = req.body
      const { email, password } = restBody

      const userExists = await User.findOne({ email })

      if (!userExists && password === repassword) {
        const user = new User(restBody)

        await user.save()

        res.status(201).json({ message: 'User has been registered successfully!' })

      } else if (restBody.password !== repassword) {
        res.status(400).json({ message: 'Password re-entry is incorrect!' })

      } else {
        res.status(400).json({ message: 'User exists!' })
      }
    } catch (err) {
      console.error(err.message)
    }
  })
}
