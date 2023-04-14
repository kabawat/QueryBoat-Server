const { userModal } = require('../')
module.exports.contact_list = async (req, res) => {
    try {
        const data = await userModal.find({ status: true }, 'username chatID profile_image email')
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
    const { image, username, contact } = req.body
    try {
        const findData = await userModal.findOne({ username: username })
        if (!findData) {
            throw new Error('invalid Username')
        }
        const isExist = findData?.contactList?.some(person => person.contact === contact);
        if (isExist) {
            throw new Error('Chat Already Exists')
        }
        const arr = [...findData?.contactList, { contact: contact, image: image }]
        let uniqueArr = arr?.filter((obj, index, self) =>
            index === self.findIndex((t) => t.contact === obj.contact)
        );
        const isUpdate = await userModal.updateOne({ username }, {
            contactList: uniqueArr
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
        const data = await userModal.find({ username: sender }, 'contactList')
        contact_list = data[0]?.contactList?.map((item) => {
            const { contact, image } = item
            return { contact, image }
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
            if (contact !== curChat?.contact) {
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