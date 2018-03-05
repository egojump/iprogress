const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('user', userSchema)
