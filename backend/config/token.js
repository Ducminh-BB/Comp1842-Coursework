const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '15d' })   // jwt sign object to payload
}

module.exports = {
    createToken
}