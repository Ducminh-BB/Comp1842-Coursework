const testVocabController = require('../controllers/testVocabController')
const {requireAuth, requireAuthAdmin} = require('../middleware/requireAuth')


const testVocabRouter = (app) => {
    app.route('/test')
        .get(requireAuthAdmin, testVocabController.viewAllTests)
        .post(requireAuth, testVocabController.addTest)
    
    app.route('/test/:id')
        .post(requireAuth, testVocabController.addTestDetail)
        .delete(requireAuth, testVocabController.deleteTest)
        .put(requireAuth, testVocabController.updateTest)

    app.route('/test/email/:email')
        .get(requireAuth, testVocabController.viewAllTestsByEmail)
        .delete(requireAuthAdmin, testVocabController.deleteTestsByEmail)
}


module.exports = testVocabRouter
