const testVocabModel = require('../models/testVocabModel')
const testVocabDetailModel = require('../models/testVocabDetailModel')

const viewAllTests = async (req, res) => {
    try {
        const tests = await testVocabModel
        .find({})
        .sort({test_type: 1})
        .populate(
            {path: 'test_detail'}
        )

        res.status(200).json(tests)

    } catch (err) {
        res.status(400).json({error: "Can't view all tests"})
    }
}

const viewAllTestsByEmail = async (req, res) => {
    try {
        const email = req.params.email

        const tests = await testVocabModel.find({
            user_email: email
        }).sort({test_type: 1}).populate(
            {path: 'test_detail'}
        )

        res.status(200).json(tests)
    } catch (err) {
        console.log(err)
        res.status(400).json({error: "Can't view all tests"})
    }
}

const addTest = async (req, res) => {
    try {
        let data = req.body
        const newTest = new testVocabModel(data)

        await newTest.save()

        res.status(200).json(newTest)
    } catch (err) {
        res.status(400).json({error: "Can't add the test"})
    }
}

const addTestDetail = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body

        const test = testVocabModel.findById(id)
        if (!test)
        {
            return res.status(400).json({error: "Can't find the test"})
        }

        const newTestDetail = new testVocabDetailModel(data)

        await newTestDetail.save()

        res.status(200).json(newTestDetail)
    } catch (err) {        
        res.status(400).json({error: "Can't add the test detail"})
    }
}

const updateTest = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body

        const test = await testVocabModel.findById(id).populate(
            {path: 'test_detail'}
        )
        if (!test)
        {
            return res.status(400).json({error: "Can't find the test"})
        }

        test.score = data.score
        await test.save()

        res.status(200).json(test)
    } catch (err) {
        console.log(err)
        res.status(400).json({error: "Can't update the test detail"})
    }
}

const deleteTest = async (req, res) => {
    try {
        let id = req.params.id
        const test = await testVocabModel.findOneAndDelete({
            _id: id
        })

        if (!test)
        {
            return res.status(400).json({error: "Test is not found"})
        }

        res.status(200).json({"message": "Delete test successfully"})

    } catch (err) {
        res.status(400).json({error: "Can't delete the test"})
    }
}

const deleteTestsByEmail = async (req, res) => {
    try {
        let email = req.params.email
        const tests = testVocabModel.deleteMany({
            user_email: email
        })

        if (!tests)
        {
            return res.status(400).json({error: "Tests are not found"})
        }

        res.status(200).json({"message": "Delete tests successfully"})

    } catch (err) {
        res.status(400).json({error: "Can't delete the tests"})
    }
}

module.exports = {
    viewAllTests,
    viewAllTestsByEmail,
    deleteTestsByEmail,
    addTest,
    addTestDetail,
    deleteTest,
    updateTest
}