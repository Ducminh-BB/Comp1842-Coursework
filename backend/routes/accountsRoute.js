const accountController = require('../controllers/accountsController')
const {requireAuth, requireAuthAdmin} = require('../middleware/requireAuth')

const accountRouter = (app) => {
    app.route('/accounts')
        .get(requireAuthAdmin, accountController.viewAllAccounts)
        .delete(requireAuthAdmin, accountController.deleteAllAccounts)        

    app.route('/accounts/:id')
        .delete(requireAuth, accountController.deleteAccount)

    app.route('/accounts/:email')
        .get(requireAuth, accountController.viewAccount)

    // authen routes

    app.route('/login')
        .post(accountController.login)

    app.route('/signup')
        .post(accountController.signup)

    // otp routes

    app.route('/verifyOTP')
        .post(accountController.verifyOTP)

    app.route('/resendOTP')
        .post(accountController.resendOTPVerificationEmail)

    app.route('/check-verification/:email')
        .get(accountController.emailVerificationChecker)
    

    app.route('/sendOTP')
        .post(accountController.sendOTPVerificationEmail)

    // password update route
    app.route('/change-password')
        .post(accountController.changePassword)

    // role-update
    app.route('/role')
        .post(requireAuthAdmin, accountController.updateRole)
}

module.exports = accountRouter