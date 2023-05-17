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
  let search = {}
  if (req.query.name) {
    search.title = { $regex: req.query.name }
  }
  if (req.query.location) {
    search.location = req.query.location
  }
  if (req.query.rooms) {
    search.rooms = req.query.rooms
  }
  if (req.query.price) {
    search.price = { $lte: req.query.price }
  }

  let houses = await Houses.find(search).sort(req.query.sort || 'price')
  res.send(houses)
})

// GET /houses/:id
app.get('/houses/:id', async (req, res) => {
  let house = await Houses.findById(req.params.id).populate({
    path: 'host',
    select: 'name avatar',
  })
  res.send(house)
})

// POST /houses
app.post('/houses', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    req.body.host = req.user._id
    let house = await Houses.create(req.body)
    res.send(house)
  }
})

// PATCH /houses/:id
app.patch('/houses/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    res.send('Hello from Houses')
  }
})

// DELETE /houses/:id
app.delete('/houses/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    res.send('Hello from Houses')
  }
})

// GET /bookings
app.get('/bookings', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    try {
      let booking = await Bookings.findOne({
        house: req.query.house,
        author: req.user._id,
      })
      booking ? res.send(booking) : res.send('invalid')
    } catch (err) {
      console.log(err)
    }
  }
})

// POST /bookings
app.post('/bookings', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    try {
      req.body.author = req.user._id
      let booking = await Bookings.create(req.body)
      res.send(booking)
    } catch (err) {
      console.log(err)
    }
  }
})

// GET /reviews
app.get('/reviews', async (req, res) => {
  try {
    let review = await Reviews.find({ house: req.query.house })
    res.send(review)
  } catch (err) {
    throw err
  }
})

// POST /reviews
app.post('/reviews', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    req.body.author = req.user._id
    let review = await Reviews.create(req.body)
    res.send(review)
  }
})

// GET /profile
app.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    res.send('Hello from profile')
  }
})

// PATCH /profile
app.patch('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('not authorized')
  } else {
    res.send('Hello from Profile')
  }
})

// POST /login
app.post('/login', async (req, res) => {
  const findUser = await Users.findOne({
    email: req.body.email,
  })

  if (!findUser) {
    res.send('invalid email')
    return
  }

  const checkPass = bcrypt.compareSync(req.body.password, findUser.password)
  if (!checkPass) {
    res.send('invalid password')
    return
  }

  req.login(findUser, (err) => {
    if (err) {
      throw err
    }
    res.send(req.user.email)
  })
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
      let user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
        password: bcrypt.hashSync(req.body.password, saltRounds),
      })

      req.login(user, () => {
        res.send(user)
      })
    }
  } catch (err) {
    console.log(err)
  }
})

// GET /logout
app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err)
      }
      res.clearCookie('connect.sid')
      res.send('Logged out')
    })
  })
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
