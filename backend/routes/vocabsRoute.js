const vocabController = require('../controllers/vocabsController')
const {requireAuthAdmin} = require('../middleware/requireAuth')

const vocabRouter = (app) => {
    app.route('/vocabs')
        .get(vocabController.viewAllVocabs)
        .post(requireAuthAdmin, vocabController.addVocab)
        .delete(requireAuthAdmin, vocabController.deleteAllVocabs)

    app.route('/vocabs/:id')
        .get(vocabController.viewVocab)
        .put(requireAuthAdmin, vocabController.editVocab)
        .delete(requireAuthAdmin, vocabController.deleteVocab)
}

module.exports = vocabRouter