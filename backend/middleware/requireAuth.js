const jwt = require('jsonwebtoken')
const accountModel = require('../models/accountsModel')

const requireAuth = async (req, res, next) => {
     
    // verify authen
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Access Denied: Authorization required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        req.account = await accountModel.findOne({_id}).select('_id role')

        next()
        
    } catch (err)
    {        
        res.status(401).json({error: 'Request is not authorized'})
    }
}

const requireAuthAdmin = async (req, res, next) => {
     
    // verify authen
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Access Denied: Authorization required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token, process.env.SECRET)
        req.account = await accountModel.findOne({_id}).select('_id role')

        if (req.account.role !== 'admin') {
            return res.status(403).json({ error: 'Access Denied: Admin Only' })
        }

        next()
        
    } catch (err)
    {        
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports = {
    requireAuth,
    requireAuthAdmin
}