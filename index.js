// Require Packages
const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const { DB_URL } = require('./db')
const Users = require('./models/users')
const Bookings = require('./models/bookings')
const Houses = require('./models/houses')
const Reviews = require('./models/reviews')
const bcrypt = require('bcrypt')
const saltRounds = 10

// Build the App
const app = express()

// Middleware
app.use(logger('tiny'))
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Database
mongoose.connect(
  DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log('Connected to MongoDB')
  }
)

// Security
require('./express-sessions')(app)

// Routes

// GET /
app.get('/', async (req, res) => {
  console.log(req.body)
  res.send('Hello from the Airbnb API')
})

// GET /houses
app.get('/houses', async (req, res) => {
  console.log(req.query)
  res.send('Hello from Houses')
})

// GET /houses/:id
app.get('/houses/:id', async (req, res) => {
  console.log(req.query)
  res.send('Hello from Houses/ID')
})

// POST /houses
app.post('/houses', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Houses')
})

// PATCH /houses/:id
app.patch('/houses/:id', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Houses/ID')
})

// DELETE /houses/:id
app.delete('/houses/:id', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Houses/ID')
})

// GET /bookings
app.get('/bookings', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Bookings')
})

// POST /bookings
app.post('/bookings', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Bookings')
})

// GET /reviews
app.get('/review', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Reviews')
})

// POST /reviews
app.post('/reviews', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Reviews')
})

// GET /profile
app.get('/profile', async (req, res) => {
  console.log(req.body)
  res.send('Heloo from Profile')
})

// PATCH /profile
app.patch('/profile', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Profile')
})

// POST /login
app.post('/login', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Login')
})

// POST /signup
app.post('/signup', async (req, res) => {
  try {
    if (
      await Users.findOne({
        email: req.body.email,
      })
    ) {
      res.send('User with this email already exists')
    } else {
      let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds)
      let user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
        password: hashedPassword,
      })
      res.send(user)
      return user
    }
  } catch (err) {
    console.log(err)
  }
})

// GET /logout
app.get('/logout', async (req, res) => {
  console.log(req.body)
  res.send('Hello from Logout')
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Error Handler
app.use((err, req, res, next) => {
  // Respond with an error
  res.status(err.status || 500)
  res.send({
    message: err,
  })
})

module.exports = app
