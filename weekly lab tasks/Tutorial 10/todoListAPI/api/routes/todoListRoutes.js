const todoListController = require('../controllers/todoListController')

const todoRoutes = (app) => {
    app.route('/tasks')
        .get(todoListController.view_all_tasks)
        .post(todoListController.create_new_task)
        .delete(todoListController.delete_all_tasks)

    app.route('/tasks/:id')
        .get(todoListController.view_single_task)
        .put(todoListController.edit_task)
        .delete(todoListController.delete_single_task)
}

module.exports = todoRoutes