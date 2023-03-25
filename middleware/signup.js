const { userModal } = require('../controller')

module.exports.signup = async (req, res, next) => {
    const { email, username, password } = req.body

    try {
        if (username && password) {
            if (email) {
                const isExist = await userModal.findOne({ email: email })
                if (isExist) {
                    if (isExist.status === false) {
                        next()
                    } else {
                        throw new Error('Something went wrong')
                    }
                } else {
                    throw new Error('Something went wrong')
                }
            } else {
                throw new Error('email is required')
            }
        } else {
            if (!username && !password) {
                throw new Error('username and password is required')
            } else if (!username) {
                throw new Error('username is required')
            } else {
                throw new Error('password is required')
            }
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            massage: error.message
        })
    }
}
