
const jwt = require('jsonwebtoken')
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