const { userModal } = require('../')
module.exports.receiver_profile = async (req, res) => {
    const { receiver } = req.params
    try {
        const data = await userModal.findOne({ username: receiver, status: true }, 'profile_image chatID')
        if (!data) {
            res.status(200).json({
                status: true,
                message: 'success',
                data: []
            })
        } else {
            res.status(200).json({
                status: true,
                message: 'success',
                data: {
                    chatID: data?.chatID,
                    image: data?.profile_image
                }
            })
        }
    } catch (error) {
        res.status(403).json({
            status: false,
            message: error.message
        })
    }
}