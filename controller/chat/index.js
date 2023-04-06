const { userModal, chatModal } = require('../')
module.exports.contact_list = async (req, res) => {
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

// create individual chat 
module.exports.new_chat = async (req, res) => {
    const { image, sender, receiver } = req.body
    try {
        const isExist = await chatModal?.findOne({ sender, receiver })
        if (isExist) {
            throw new Error('chat already exists')
        }
        const chatData = new chatModal({
            image: image,
            sender: sender,
            receiver: receiver,
        })
        const saveData = await chatData.save()
        if (!saveData) {
            throw new Error('Error saving data')
        }
        res.status(200).json({
            status: true,
            message: 'chat created'
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message
        })
    }
}

// fetch individual chat 
module.exports.individualChat = async (req, res) => {
    const { sender } = req.params
    try {
        const data = await chatModal.find({ sender: sender }, 'image receiver')
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
                data: data
            })
        }
    } catch (error) {
        res.status(404).json({
            status: false,
            message: error.message
        })
    }
}