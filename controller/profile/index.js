const { userModal } = require('../')
module.exports.profile = async (req, res) => {
    try {
        const { token } = req.headers
        const { user } = req.params
        const profileData = await userModal.findOne({ username: user, token })
        if (!profileData) {
            throw new Error('something wrong')
        }
        const profile = {
            username: profileData.username,
            email: profileData.email,
            profile_image: profileData.profile_image
        }
        res.status(200).json({
            status: true,
            message: "success",
            data: profile
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message,
            data: {}
        })
    }
}