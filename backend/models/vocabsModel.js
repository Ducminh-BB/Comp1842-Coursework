const mongoose = require('mongoose')

const vocabSchema = new mongoose.Schema({
    english: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true
    },
    german: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true
    },
    vietnamese: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true
    }

})

const vocabModel = mongoose.model('vocabs', vocabSchema)

module.exports = vocabModel