const { encrypt, isMatched } = require('../config/encryption')
const accountsModel = require('../models/accountsModel')
const { createToken } = require('../config/token')
const emailOTPVerification = require('../models/emailOTPVerificationModel')
const { isValidEmail, isValidPassword } = require('../config/InputValidation')
const nodemailer = require('nodemailer')
const validateEmailDomain = require('../config/emailValidation')


// use of login section

const sendOTP = async (email) => {
    try {

        const records = await accountsModel.find({
            email: email
        })

        if (records.length <= 0)
        {
            return res.status(400).json({error: 'Your account is not available.'})
        }

        const otp = `${Math.floor(100000 + Math.random() * 900000)}`

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> to verify your email address. <p>This otp <b>expires in 2 minutes</b>. </p>`
        }

        // encrypt the otp
        const hashedOTP = await encrypt(otp)

        const newOtpVerf = new emailOTPVerification({
            email: email,
            otp: hashedOTP,
            createAt: Date.now(),
            expiresIn: Date.now() + 120000
        })

        // save otp record
        await newOtpVerf.save()
        
        await transporter.sendMail(mailOptions)

    } catch (err) {
        throw new Error()
    }
}

// send otp

const sendOTPVerificationEmail = async (req, res) => {
    try {
        let { email } = req.body
        
        if (!email)
        {
            return res.status(400).json({error: "Email can't be blank. Please fill in this field."})
        }

        const records = await accountsModel.find({
            email: email
        })

        if (records.length <= 0)
        {
            console.log('here')
            throw new Error()
        }

        sendOTP(email)

        res.status(200).json({"message": "OTP has been sent successfully."})

    } catch (err) {
        res.status(400).json({error: "Something prevent OTP to be resent. Please check Internet connection or anything else. Error: "+err})
    }
}

// allow to resend otp

const resendOTPVerificationEmail = async (req, res) => {
    try {
        let { email } = req.body

        if (!email)
        {
            return res.status(400).json({error: "Email can't be blank. Please fill in this field."})
        }

        const records = await accountsModel.find({
            email: email
        })

        if (records.length <= 0)
        {
            return res.status(400).json({error: 'Your account is not available or has been verified already. Please sign up or log in'})
        }

        await emailOTPVerification.deleteMany({
            email: email
        })
        sendOTP(email)

        res.status(200).json({"message": "OTP has been resent successfully."})
    } catch (err) {
        res.status(400).json({error: "Something prevent OTP to be resent. Please check Internet connection or anything else. Error: "+err})
    }
}

// create a transporter

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

//testing success
transporter.verify((err, succ) => {
    if (err)
    {
        console.error(err)
    } else {
        console.log(`NODEMAILER ready: ${succ}`)        
    }
})

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp)
        {
            return res.status(400). json({error: 'OTP is not valid'})
        }
        const records = await emailOTPVerification.find({
            email: email
        })

        if (records.length <= 0)
        {
            return res.status(400).json({error: 'Your account is not available or has been verified already. Please sign up or log in'})
        } 
        const { expiresIn } = records[0]
        const hashedOTP = records[0].otp

        if (expiresIn < Date.now())
        {
            await emailOTPVerification.findOneAndDelete({
                email: email
            })
            return res.status(400).json({error: 'OTP has expired. Please request another OTP.'})
        } 

        const isValidOTP = await isMatched(otp, hashedOTP)

        if (!isValidOTP)
        {
            return res.status(400).json({
                error: 'Invalid OTP. Please check your otp again.'
            })
        }

        // update the verified status after user successfully verified

        await accountsModel.findOneAndUpdate({
            email: email
        }, {
            verified: true
        })
        
        // delete all otps are existing of this account

        await emailOTPVerification.deleteMany({
            email: email
        })

        res.status(200).json({"message": "Your account is successfully verified. Please log in to access the page."})
    } catch (err) {
        res.status(400).json({error: 'Something is wrong when receiving OTP'})
    }
}

const viewAllAccounts = async (req, res) => {
    try
    {
        let accounts = await accountsModel.find({}).select('-password')

        res.status(200).json(accounts)
    }
    catch (err)
    {
        res.send(err)
    }
}

const deleteAllAccounts = async (req, res) => {
    try
    {
        await accountsModel.deleteMany()

        res.json({"message": "Delete all accounts successfully"})
    }
    catch (err)
    {
        res.json({error: "Delete all accounts failed"})
    }
}

const addAccount = async (req, res) => {
    try
    {
        let {email, password} = req.body
        email = email.trim()
        password = password.trim()

        let emptyFields = []

        if (!email){
            emptyFields.push('email')
        }
        if (!password){
            emptyFields.push('password')
        }
        if (emptyFields.length > 0){
            return res.status(400).json({error: 'Please fill in all the required fields', emptyFields})
        }

        const isEmailDomainExisted = await validateEmailDomain(email)

        if (!isValidEmail(email) || !isEmailDomainExisted)
        {
            return res.status(400).json({error: 'Provided an invalid email'})
        }

        if (!isValidPassword(password))
        {
            return res.status(400).json({error: 'Provided an invalid password'})
        }

        password = await encrypt(password)

        const account = await accountsModel.create({email, password})

        let id = account._id

        try {
            sendOTP(account.email)
        } catch (err) {
            return res.status(400).json({error: "Can't send otp to verify the email!"})
        }

        res.status(201).json({id, email})
    }
    catch (err)
    {
        throw new Error()
    }
}

const viewAccount = async (req, res) => {
    try
    {
        let email = req.params.email

        let account = await accountsModel.findOne({email: email}).select('-password')
        if (!account)
        {
            return res.status(404).json({error: 'the account is not available'})
        }

        return res.status(200).json(account)
    }
    catch (err)
    {
        return res.status(503).json({error: "Can't view the account"})
    }
}


const deleteAccount = async (req, res) => {
    try
    {
        let id = req.params.id
        let account = await accountsModel.findByIdAndDelete(id)
        if (!account)
        {
            return res.status(404).json({error: 'the account is not available'})
        }

        res.json({"message": "Delete account succeed"})
    }
    catch (err)
    {
        res.status(503).json({error: "Can't delete the account"})
    }
}

const login = async (req, res) => {
    try
    {
        const { email, password } = req.body

        let emptyFields = []

        if (!email){
            emptyFields.push('email')
        }
        if (!password){
            emptyFields.push('password')
        }
        if (emptyFields.length > 0){
            return res.status(400).json({error: 'Please fill in all the required fields.', emptyFields})
        }
        
        const isEmailDomainExisted = await validateEmailDomain(email)

        if (!isValidEmail(email) || !isEmailDomainExisted)
        {
            return res.status(400).json({error: 'Provided an invalid email.'})
        }

        if (!isValidPassword(password))
        {
            return res.status(400).json({error: 'Provided an invalid password.'})
        }

        const account = await accountsModel.findOne({ email })

        if (!account)
        {
            return res.status(400).json({error: 'Email address is not available.'})
        }

        let isMatch = await isMatched(password, account.password)
        

        if (!isMatch)
        {
            return res.status(400).json({error: 'Incorrect password.'})
        }

        let role = account.role

        const token = createToken(account._id)
        res.status(200).json({email, role, token})

    } catch (err)
    {
        res.status(500).json({error: "failed to login."})
    }
        
}

const signup = async (req, res) => {
    try
    {
        await addAccount(req, res)
    }
    catch (err)
    {
        res.status(400).json({error: "Email is already existed!"})
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body

        const account = await accountsModel.findOne({
            email: email
        })

        if (!account)
        {
            return res.status(400).json({error: 'Email address is not available'})
        }

        if (!isValidPassword(password))
        {
            return res.status(400).json({error: 'Provided an invalid password'})
        }

        // hash a new password

        const encryptedPassword = await encrypt(password)

        // update a current password

        await accountsModel.findByIdAndUpdate(account._id, {
            password: encryptedPassword
        })

        return res.status(200).json({"message": "Updated password successfully"})

    } catch (err) {
        return res.status(400).json({error: "Can't change password"+err})
    }
}

const emailVerificationChecker = async (req, res) => {
    try {
        const email = req.params.email

        const account = await accountsModel.findOne({
            email: email
        })

        if (!account)
        {
            return res.status(400).json({error: 'Email address is not available'})
        }

        res.status(200).json({isVerified: account.verified})
    } catch (err) {
        res.status(400).json({error: "Can't verify the email"})
    }
}

module.exports = {
    viewAllAccounts,
    deleteAllAccounts,
    viewAccount,
    deleteAccount,
    login,
    signup,
    verifyOTP,
    sendOTPVerificationEmail,
    resendOTPVerificationEmail,
    changePassword,
    emailVerificationChecker
}