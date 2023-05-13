const { unlinkSync } = require('fs')
const path = require('path')
const { messageModal } = require('../')
async function deleteMessage(req, res) {
    const { file, id } = req?.body
    try {
        const isData = await messageModal.findByIdAndDelete(id)
        if (!isData) {
            throw new Error('somthing wrong')
        }

        if (file) {
            const rootDir = path.dirname(require.main.filename);
            const fileDir = path.join(rootDir, `public/${file}`)
            unlinkSync(fileDir)
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