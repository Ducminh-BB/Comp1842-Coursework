const mongoose = require('mongoose')

// declare schema (design/structure of collection-table)
const todoListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Kindly enter the name of the task'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'complete']
        }],
        default: ['pending']
    }

})

module.exports = mongoose.model("tasks", todoListSchema)