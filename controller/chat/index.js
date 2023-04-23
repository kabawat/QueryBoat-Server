const { userModal } = require('../')
module.exports.contact_list = async (req, res) => {
    try {
        const { status, contactList } = req?.email_data
        if (!status) {
            throw new Error('invalid credentials')
        }
        const data = await userModal.find({ username: { $nin: contactList } }, 'username chatID profile_image email')
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
    const { username, contact } = req.body
    try {
        const findData = await userModal.findOne({ username: username })
        if (!findData) {
            throw new Error('invalid Username')
        }
        const isExist = findData?.contactList?.includes(contact);
        if (isExist) {
            throw new Error('Chat Already Exists')
        }
        const arr = [...findData?.contactList, contact]
        const isUpdate = await userModal.updateOne({ username }, {
            contactList: [...new Set(arr)]
        })

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
        const findContact = await userModal.findOne({ username: sender }, 'contactList')
        if (!findContact) {
            throw new Error('invalid user')
        }
        const data = await userModal.find({ username: { $in: findContact?.contactList } }, 'username profile_image');
        contact_list = data?.map((item) => {
            const { username, profile_image } = item
            return { contact: username, image: profile_image }
        })
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
                data: contact_list
            })
        }
    } catch (error) {
        res.status(404).json({
            status: false,
            message: error.message
        })
    }
}

// remove individual chat
module.exports.remove_chat = async (req, res) => {
    const { username, contact } = req.body
    try {
        const data = await userModal.findOne({ username })
        if (!data?.contactList) {
            throw new Error('no more chat ')
        }
        const newList = data?.contactList?.filter((curChat) => {
            if (contact !== curChat) {
                return curChat
            }
        })
        await userModal.updateOne({ username }, {
            contactList: newList
        })
        res.status(200).json({
            status: true,
            message: 'remove chat success'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}
