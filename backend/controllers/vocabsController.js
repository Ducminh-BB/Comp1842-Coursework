const vocabModel = require('../models/vocabsModel')

const viewAllVocabs = async (req, res) => {
    try
    {
        let vocabs = await vocabModel.find({}).sort({english: 1})

        res.json(vocabs)
    }
    catch (err)
    {
        res.status(400).json({error: "View all vocabs failed"})
    }
}

const addVocab = async (req, res) => {
    try
    {
        let data = req.body

        await vocabModel.create(data)
        res.status(200).json({"message": "Add new vocab succeed"})
    }
    catch (err)
    {
        res.status(400).json({error: "Add new vocab failed"})
    }
}

const deleteAllVocabs = async (req, res) => {
    try
    {
        await vocabModel.deleteMany()

        res.status(200).json({"message": "Delete all vocabs successfully"})
    }
    catch (err)
    {
        res.status(400).json({error: "Delete all vocabs failed"})
    }
}

const viewVocab = async (req, res) => {
    try
    {
        let id = req.params.id
        let vocabData = await vocabModel.findById(id)
        if (!vocabData)
        {
            return res.status(404).json({error: 'the vocab is not available'})
        }
        res.status(200).json(vocabData)
    }
    catch (err)
    {
        res.status(400).json({error: "View vocab failed"})
    }
}

const editVocab = async (req, res) => {
    try
    {
        let id = req.params.id
        let data = req.body
        let vocabData = await vocabModel.findByIdAndUpdate(id, data)
        if (!vocabData)
        {
            return res.status(404).json({error: 'the vocab is not available'})
        }
        res.status(200).json(vocabData)
    }
    catch (err)
    {
        res.status(400).json({error: "Update vocab failed"})
    }
}

const deleteVocab = async (req, res) => {
    try
    {
        let id = req.params.id
        vocabData = await vocabModel.findByIdAndDelete(id)
        if (!vocabData)
        {
            return res.status(404).json({error: 'the vocab is not available'})
        }
        res.status(200).json(vocabData)
    }
    catch (err)
    {
        res.status(400).json({error: "Delete vocab failed"})
    }
}


module.exports = {
    viewAllVocabs,
    addVocab,
    deleteAllVocabs,
    viewVocab,
    editVocab,
    deleteVocab
}