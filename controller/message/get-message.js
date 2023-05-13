const { messageModal } = require('../')
async function getMessage(req, res) {
    try {
        const { chatFile } = req?.body
        const isMessage = await messageModal.find({ chatFile: chatFile }, 'message file msgType time sender')
        res.status(200).json({
            status: true,
            message: 'message fetch Success',
            data: isMessage
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message,
            data: []
        })
    }
}
module.exports = getMessage