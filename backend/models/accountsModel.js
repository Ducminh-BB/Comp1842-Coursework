const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'User'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'client'
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const accountModel = mongoose.model('accounts', accountSchema)

module.exports = accountModel