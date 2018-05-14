const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const timestamp = require('mongoose-timestamp')

const loginCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  code: {
    type: String,
    unique: true
  }
})

loginCodeSchema.plugin(uniqueValidator)
loginCodeSchema.plugin(timestamp)

module.exports = mongoose.model('login_code', loginCodeSchema)
