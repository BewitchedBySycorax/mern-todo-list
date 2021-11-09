/* eslint-disable global-require */
const { bold } = require('cli-color')
const path = require('path')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const consolidate = require('consolidate')
const hbs = require('handlebars')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const checkAuthentication = require('./middlewares/checkAuthentication')

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
app.use('/api/tasks', checkAuthentication)

switch (process.env.CLIENT) {
  case 'native':
    app.get('/', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'html', 'index.html'))
    })

    app.get('/auth', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'html', 'auth.html'))
    })
    break
  case 'react':
    break
  default:
    app.get('/', (req, res) => req.user ? res.redirect('/tasks') : res.redirect('/auth'))
}

require('./controllers/user')(app)
require('./controllers/tasks')(app)
require('./index')(app) // API

app.listen(PORT, () => console.log(bold.underline.xterm(226)(`Server has been started on localhost: ${PORT}\n`)))
