
const jwt = require('jsonwebtoken')
const { userModal } = require('../controller')
module.exports.verify = async (req, res, next) => {
    const { PRIVATE_KEY_JWT } = process.env
    try {
        const { token } = req.headers
        let isVerify = jwt.verify(token, PRIVATE_KEY_JWT)
        if (!isVerify) {
            throw new Error('unauthorized token')
        }
        next()
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message,
            data: {}
        })
    }
}

module.exports.usernameUnique = async (req, res, next) => {
    try {
        const { username } = req?.body
        const isExits = await userModal.findOne({ username: username })
        if (isExits) {
            throw new Error('username already exists.')
        }
        res.status(200).json({
            status: true,
            message: 'verified username'
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}

module.exports.emailUnique = async (req, res, next) => {
    try {
        const { email } = req?.body
        const isExits = await userModal.findOne({ email: email, status: true })
        if (isExits) {
            throw new Error('email already exists.')
        }
        res.status(409).json({
            status: true,
            message: 'verified email'
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}