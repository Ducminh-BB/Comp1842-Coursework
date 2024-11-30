const bcrypt = require('bcryptjs');

// Encryption of the string thing

const encrypt = async (thingToEncrypt) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(thingToEncrypt, salt)
        return hashedPassword
    } catch (err) {
        console.log('Cannot encrypt', err)

        return undefined
    }
}

const isMatched = async (thing, hashedThing) => {
    try
    {
        const isMatch = await bcrypt.compare(thing, hashedThing)
        return isMatch
    } catch (err)
    {
        console.log(err)
        return false
    }
}

module.exports = {
    encrypt,
    isMatched
}
