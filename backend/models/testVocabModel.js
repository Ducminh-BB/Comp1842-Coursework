const mongoose = require('mongoose')
const testVocabDetailModel = require('./testVocabDetailModel')

const testVocabSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    test_type: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    }

}, {timestamps: true})

testVocabSchema.virtual('test_detail', {
    ref: 'testDetailVocab',
    localField: '_id',
    foreignField: 'test'
})

testVocabSchema.set('toObject', { virtuals: true })
testVocabSchema.set('toJSON', { virtuals: true })

// cascade delete all the test detail if the test is deleted

testVocabSchema.pre('findOneAndDelete', async function (next) {
    const testId = this.getQuery()._id

    await testVocabDetailModel.deleteMany(
        {test: testId}
    )

    next()
})

testVocabSchema.pre('deleteMany', async function (next) {
    const testId = this.getQuery()._id

    await testVocabDetailModel.deleteMany(
        {test: testId}
    )

    next()
})

const testVocabModel = mongoose.model('testVocab', testVocabSchema)

module.exports = testVocabModel