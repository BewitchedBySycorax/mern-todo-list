/* eslint-disable global-require */
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const checkAuthentication = require('./middlewares/auth')

const PORT = process.env.PORT || 8000

const app = express()

require('./db/connection')() // Database connection

app.use(bodyParser.urlencoded({ extended: true })) // if false - either string or array in req.body
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'client')))
app.use('/tasks', checkAuthentication)

require('./api/index')(app) // API

app.get('/', (_req, res) => res.sendFile(path.resolve(__dirname, 'client', 'index.html')))
app.get('/auth', (_req, res) => res.sendFile(path.resolve(__dirname, 'client', 'auth.html')))

app.listen(PORT, () => console.log(`Server has been started on port:${PORT}`))
