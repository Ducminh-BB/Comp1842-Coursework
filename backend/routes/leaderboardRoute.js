const leaderboardController = require('../controllers/leaderboardController')
const {requireAuth, requireAuthAdmin} = require('../middleware/requireAuth')


const leaderboardRouter = (app) => {
    app.route('/leaderboard')
        .get(requireAuth, leaderboardController.viewLeaderboard)
        .post(requireAuth, leaderboardController.addField)        

    app.route('/leaderboard/:test/:email')
        .get(requireAuth, leaderboardController.viewField)
        .put(requireAuth, leaderboardController.updateField)
        .delete(requireAuthAdmin, leaderboardController.deleteField)
        
}

module.exports = leaderboardRouter