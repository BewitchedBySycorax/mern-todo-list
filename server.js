/* eslint-disable global-require */
const { bold } = require('cli-color')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
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
app.use(bodyParser.urlencoded({ extended: true })) // if false - only string or array in req.body
app.use(express.json())
app.use(session({
  resave: true, // Resave session if something has been changed
  saveUninitialized: false, // No session creation for unauthorized users
  secret: 'BqXaaz3q', // Session signature ( session ID --> cookies ) for session ID secure - some private key only server knows
  store: new MongoStore({ mongooseConnection: mongoose.connection }) // Store for the sessions
}))
app.use(passport.initialize)
app.use(passport.session)
app.use('/tasks', passport.mustBeAuthenticated)

require('./controllers/user')(app)
require('./controllers/tasks')(app)

app.get('/', (req, res) => req.user ? res.redirect('/tasks') : res.redirect('/auth'))

app.listen(PORT, () => console.log(bold.underline.xterm(226)(`Server has been started on localhost: ${PORT}\n`)))
