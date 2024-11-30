const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true,        
        immutable: true  // prevent the client to update user_email
    },
    highScore: {
        type: Number,
        default: 0        
    },
    streaks: {
        type: Number,
        default: 0
    },
    test_type: {
        type: String
    }
})

const leaderboardModel = mongoose.model('leaderboard', leaderboardSchema)

module.exports = leaderboardModel