const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let Bookings = mongoose.model('bookings', {
    author: {
        type: ObjectId,
        required: true,
        ref: 'users'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now

    },
    description: {
        type: String,
        requred: true
    },
    house: {
        type: ObjectId,
        required: true,
        reference: 'houses'
    }

})

module.exports = Bookings