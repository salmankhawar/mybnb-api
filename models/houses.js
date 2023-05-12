const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let Houses = mongoose.model('houses', {
  description: {
    type: String,
    required: true,
  },
  host: {
    type: ObjectId,
    required: true,
    ref: 'users',
  },
  location: {
    type: String,
    required: true,
  },
  photos: [String],
  price: {
    type: Number,
    required: true,
  },
  rooms: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

module.exports = Houses
