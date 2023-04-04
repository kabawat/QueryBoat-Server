
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

// ----------------------------- { username }  --------------------------------
// unique username 
module.exports.uniqueUsername = async (req, res, next) => {
    try {
        const { username } = req?.body
        const isExits = await userModal.findOne({ username })
        if (isExits) {
            throw new Error('username already exits')
        }
        next()
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}

// username validation 
module.exports.isUsername = async (req, res, next) => {
    try {
        const { username } = req?.body
        if (!username) {
            throw new Error('username is required')
        }
        const regex = /\s/;
        if (regex.test(username)) {
            throw new Error('invalid username')
        }
        next()
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}


// ------------------------------- { email }----------------------------------
// Unique Email 
module.exports.uniqueEmail = async (req, res, next) => {
    try {
        const { email } = req?.body
        const isExits = await userModal.findOne({ email })
        if (isExits) {
            if (isExits?.status) {
                throw new Error('email already exits')
            }
            else {
                req.email_data = isExits
            }
        }
        next()
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}

// email validation 
module.exports.isEmail = async (req, res, next) => {
    try {
        const { email } = req?.body
        if (!email) {
            throw new Error('email is required')
        }
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = pattern.test(email);
        if (!isValid) {
            throw new Error('invalid email format')
        }
        next()
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}

// fetch data using email 
module.exports.emailData = async (req, res, next) => {
    try {
        const { email } = req.body
        console.log('here')
        const isData = await userModal.findOne({ email })
        if (isData === null) {
            throw new Error('user not exits')
        }
        console.log('here 2')
        req.email_data = isData
        next()
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message
        })
    }
}