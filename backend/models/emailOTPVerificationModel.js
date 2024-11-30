const mongoose = require('mongoose')

const emailOTPVerificationSchema = new mongoose.Schema({
    email: {
        type: String
    },
    otp: {
        type: String
    },
    createAt: {
        type: Date
    },
    expiresIn: {
        type: Date
    }
})

const emailOTPVerification = mongoose.model('emailOTPVerification', emailOTPVerificationSchema)

module.exports = emailOTPVerification