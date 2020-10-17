const passport = require('../auth/auth')
const User = require('../db/models/user')

module.exports = app => {
  app.get('/register', (req, res) => {
    const { error } = req.query

    res.render('../views/register', { error })
  })

  app.post('/register', async (req, res) => {
    try {
      const { repassword, ...restBody } = req.body

      if (restBody.password === repassword) {
        const user = new User(restBody)

        await user.save()

        req.logout()
        res.redirect('/auth')

      } else {
        res.redirect('/register?error=repass')
      }
    } catch (e) {
      console.error(e.message)
    }
  })

  app.get('/auth', (req, res) => {
    if (req.user) return res.redirect('/tasks')

    const { error } = req.query

    res.render('../views/auth', { error })
  })

  app.post('/auth', passport.authenticate)

  app.get('/logout', (req, res) => {
    req.logout()

    res.redirect('/auth')
  })
}
