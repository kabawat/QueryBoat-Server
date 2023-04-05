const { socketModal } = require('../')
module.exports.chatlist = async (req, res) => {
    try {
        const data = await socketModal.find()
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