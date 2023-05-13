const { userModal } = require('../')
async function profile(req, res) {
    try {
        const { token } = req.headers
        const { user } = req.params
        const profileData = await userModal.findOne({ username: user, token }, `username email profile_image f_name l_name contactList`)
        if (!profileData) {
            throw new Error('something wrong')
        }
        res.status(200).json({
            status: true,
            message: "success",
            data: profileData
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message,
            data: {}
        })
    }
}
module.exports = profile