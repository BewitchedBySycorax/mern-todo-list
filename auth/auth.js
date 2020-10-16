const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../db/models/user')

passport.use(
  // Done is a callback function to determine whether user has been successfully authorized
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username })

      if (!user || !user.validatePassword(password)) {
        return done(null, false) // null is reserved for error handling
      }

      const plainUser = JSON.parse(JSON.stringify(user))

      delete plainUser.password

      done(null, plainUser) // req.user

    } catch (e) {
      console.error(e.message)
    }
  })
)

// User is plainUser from above here
passport.serializeUser((user, done) => {
  done(null, user._id) // Saving user ID to the session to recognize him (the user) in future
})

// This is used when the user comes in future
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    const plainUser = JSON.parse(JSON.stringify(user))

    delete plainUser.password

    done(null, plainUser) // req.user

  } catch (e) {
    console.error(e.message)
  }
})

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth?error=1'
  }),
  mustBeAuthenticated: (req, res, next) => req.user ? next() : res.redirect('/auth')
}
