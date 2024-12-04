const todoListModel = require('../models/todoListModels')

const view_all_tasks = async (req, res) => {
    // get data from "tasks" collection
    const tasks = await todoListModel.find({})

    try{
        // response this data as JSON format
        res.json(tasks)
    }catch (err){
        res.send(err)
    }
}

const create_new_task = async (req, res) => {
    try{
        const {name, Created_date, status} = req.body

        console.log({name, Created_date, status})
        await todoListModel.create({name, Created_date, status})
        
        res.json({"message": "Add new task succeed"})
    } catch (err){
        console.log(err)
        res.json({"message": "Add new task failed"})
    }
}

const view_single_task = async (req, res) => {
    //get id from url
    const id = req.params.id

    //get data from task based on this id
    const task = await todoListModel.findById(id)

    try{
        // response this data as JSON format
        res.json(task)
    }catch (err){
        res.send(err)
    }

}

const edit_task = async (req, res) => {
    let id = req.params.id
    let data = req.body

    try{
        await todoListModel.findByIdAndUpdate(id, data)

        res.json({"message": "Update task succeed"})
    } catch (err){
        res.json({"message": "Update task failed"})
    }
}

const delete_single_task = async (req, res) => {
    const id = req.params.id
    
    try{
        await todoListModel.findByIdAndDelete(id)
        res.json({"message": "delete task succeed"})
    }
    catch (err){
        res.json({"message": "delete task failed: "+err})
    }
}


const delete_all_tasks = async (req, res) => {
    
    try{
        await todoListModel.deleteMany()
        res.json({"message": "delete all tasks succeed"})
    }
    catch (err){
        res.json({"message": "delete all tasks failed: "+err})
    }
}

module.exports = {
    view_all_tasks,
    view_single_task,
    delete_single_task,
    delete_all_tasks,
    create_new_task,
    edit_task
}