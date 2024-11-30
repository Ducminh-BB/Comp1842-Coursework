const leaderboardModel = require('../models/leaderboardModel')


const viewLeaderboard = async (req, res) => {
    try
    {
        const ld = await leaderboardModel.find({}).sort({
            highScore: -1
        })

        res.json(ld)
    } catch (err)
    {
        res.status(400).json({error: "View leaderboard failed"})
    }
}

const viewField = async (req, res) => {
    try
    {
        let email = req.params.email
        let test = req.params.test

        let field = await leaderboardModel.findOne({user_email: email, test_type: test})
        if (!field)
        {
            return res.status(404).json({error: 'the field is not available'})
        }

        return res.status(200).json(field)
    }
    catch (err)
    {
        return res.status(503).json({error: "Can't view the field"})
    }
}

const addField = async (req, res) => {
    try
    {
        let data = req.body

        await leaderboardModel.create(data)
        res.status(201).json({"message": "Add new field succeed"})
    } catch (err)
    {
        console.log(err)
        res.status(400).json({error: "Add new field failed"})
    }
}

const updateField = async (req, res) => {
    try
    {
        let email = req.params.email
        let test = req.params.test
        let data = req.body
        let field = await leaderboardModel.findOneAndUpdate({
            user_email: email,
            test_type: test
        }, data, {
            new: true
        })

        if (!field)
        {
            return res.status(404).json({error: 'the field is not available'})
        }
        res.status(200).json({"message": "Update field succeed"})
    } catch (err)
    {
        res.status(400).json({error: "Update field failed"})
    }
}

const deleteField = async (req, res) => {
    try
    {   
        let email = req.params.email
        let test = req.params.test
        let field = await leaderboardModel.findOneAndDelete({
            user_email: email,
            test_type: test
        })
        if (!field)
        {
            return res.status(404).json({error: 'the field is not available'})
        }
        res.status(200).json({"message": "Delete field succeed", data: field})
    } catch (err)
    {
        res.status(400).json({error: "Delete field failed"})
    }
}


module.exports = {
    viewLeaderboard,
    deleteField,
    addField,
    updateField,
    viewField
}

