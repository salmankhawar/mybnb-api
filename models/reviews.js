const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
let Reviews = mongoose.model('reviews', {
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
        required: true 
    },
    house: {
        type: ObjectId,
        required: true,
        ref: 'houses'
    }, 
    rating: Number
})
module.exports = Reviews