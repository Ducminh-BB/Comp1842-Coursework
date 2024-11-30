const mongoose = require('mongoose')

const testVocabDetailSchema = new mongoose.Schema({
    question: {
        type: String
    },
    correctAns: {
        type: String
    },
    ans: {
        type: String
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'testVocab',
        required: true
    }

})

const testVocabDetailModel = mongoose.model('testDetailVocab', testVocabDetailSchema)

module.exports = testVocabDetailModel