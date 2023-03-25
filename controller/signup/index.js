const { userModal } = require('../')
const jwt = require('jsonwebtoken')
const privateKey = process.env.PRIVATE_KEY_JWT
module.exports.registration = async (req, res) => {
    const { email, username, password } = req.body
    console.log(privateKey)
    try {
        const update = await userModal.updateOne({ email: email }, {
            username,
            opt: null,
            status: true,
            password,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        const token = jwt.sign({ email, username }, privateKey)
        res.status(200).json({
            status: true,
            massage: 'registration successful',
            token
        })
    } catch (error) {
        res.status(401).json({
            status: false,
            massage: error.message
        })
    }
}
