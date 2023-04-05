const { userModal } = require('../')
module.exports.chatlist = async (req, res) => {
    try {
        const data = await userModal.find({}, 'username chatID profile_image email')
        res.status(200).json({
            data: data,
            status: true
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false
        })
    }
}