/* eslint-disable global-require */
const { bold } = require('cli-color')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const consolidate = require('consolidate')
const hbs = require('handlebars')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const passport = require('./auth/auth')

require('./db/connection')() // Database connection

const PORT = process.env.PORT || 8000

const app = express()

// Handlebars custom if_eq helper
hbs.registerHelper('if_eq', function (var1, var2, options) {
  if (var1 === var2) {
    return options.fn(this)
  }

  return options.inverse(this)
})

app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs')

// Middlewares
app.use(express.urlencoded({ extended: true })) // if false - either string or array in req.body
app.use(express.json())
app.use(cors())
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'BqXaaz3q',
  cookie: { maxAge: 900000 }, // 15 min expiration time
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize)
app.use(passport.session)
app.use('/tasks', passport.mustBeAuthenticated)

// Custom middleware
const checkAuthentication = (req, res, next) => {
  const { authorization } = req.headers

  if (authorization) {
    // eslint-disable-next-line no-unused-vars
    const [_type, token] = authorization.split(' ') // authorization: Bearer <token>

    jwt.verify(token, '9UwBWnYD', (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Some error occurred! Please check authorization token and try again.' })

      req.user = decoded // decoded === token payload

      next()
    })

  } else {
    res.status(403).json({ message: 'Some error occurred! Please check authorization token and try again.' })
  }
}

app.use('/api/tasks', checkAuthentication)

require('./controllers/user')(app)
require('./controllers/tasks')(app)
require('./index')(app) // API

app.get('/', (req, res) => req.user ? res.redirect('/tasks') : res.redirect('/auth'))

app.listen(PORT, () => console.log(bold.underline.xterm(226)(`Server has been started on localhost: ${PORT}\n`)))
