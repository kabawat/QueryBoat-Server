const { messageModal } = require('../')
async function deleteMessage(req, res) {
    try {
        const isData = await messageModal.findByIdAndDelete(req.body?.id)
        if (!isData) {
            throw new Error('somthing wrong')
        }
        res.status(200).json({
            status: true,
            message: 'message delete Success',
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message,
            data: []
        })
    }
}
module.exports = deleteMessage