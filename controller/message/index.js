const { messageModal, userModal } = require('../')
async function messageStore(req, res) {
    try {
        const { message, msgType, sender, chatFile, receiver } = req.body
        console.log(receiver)
        let msgData = { message, msgType, sender, chatFile }
        const newMessage = new messageModal(msgData)
        const isStore = await newMessage.save()
        const isUser = await userModal.findOne({ username: receiver }, 'chatID')
        if (!isStore || !isUser) {
            throw new Error('message sending feiled')
        }
        res.status(200).json({
            status: true,
            message: 'message send success',
            chatID: isUser?.chatID
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message,
        })
    }
}

module.exports = messageStore