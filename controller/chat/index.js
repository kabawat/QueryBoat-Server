const { userModal } = require('../')
module.exports.contact_list = async (req, res) => {
    try {
        const { status, contactList } = req?.email_data
        let list = []
        contactList.map((curItem) => {
            list.push(curItem?.contact)
        })
        if (!status) {
            throw new Error('invalid credentials')
        }
        const data = await userModal.find({ username: { $nin: list } }, 'username chatID profile_image email')
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
    function generateFolderName() {
        const currentDate = new Date();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const folderName = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}_${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}_${randomStr}`;
        return folderName;
    }

    const { username, contact } = req.body
    try {
        const findData = await userModal.findOne({ username: username })
        if (!findData) {
            throw new Error('invalid Username')
        }
        const isExist = findData?.contactList?.some(person => person.contact === contact);
        // const isExist = findData?.contactList?.includes(contact);
        if (isExist) {
            throw new Error('Chat Already Exists')
        }
        // const arr = [...findData?.contactList, contact]

        const chatFile = generateFolderName()
        const arr = [...findData?.contactList, { contact: contact, chatFile, status: true }]
        let uniqueArr = arr?.filter((obj, index, self) =>
            index === self.findIndex((t) => t.contact === obj.contact)
        );

        const isUpdate = await userModal.updateOne({ username }, {
            contactList: uniqueArr
        })

        res.status(200).json({
            status: true,
            message: 'chat created',
            chatFile,
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message
        })
    }
}

// new Chat Request individual chat 
module.exports.new_chat_request = async (req, res) => {
    const { username, contact, chatFile } = req.body
    try {
        const findData = await userModal.findOne({ username: username })
        if (!findData) {
            throw new Error('invalid Username')
        }
        const isExist = findData?.contactList?.some(person => person.contact === contact);
        // const isExist = findData?.contactList?.includes(contact);
        if (isExist) {
            throw new Error('Chat Already Exists')
        }
        // const arr = [...findData?.contactList, contact]
        const arr = [...findData?.contactList, { contact: contact, chatFile, status: false }]
        let uniqueArr = arr?.filter((obj, index, self) =>
            index === self.findIndex((t) => t.contact === obj.contact)
        );

        const isUpdate = await userModal.updateOne({ username }, {
            contactList: uniqueArr
        })

        res.status(200).json({
            status: true,
            message: 'chat created',
            chatFile,
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
        let list = []
        findContact?.contactList.map((curItem) => {
            list.push(curItem?.contact)
        })
        const data = await userModal.find({ username: { $in: list } }, 'username profile_image f_name l_name');
        contact_list = data?.map((item, index) => {
            const { chatFile } = findContact?.contactList[index]
            const { username, profile_image, f_name, l_name } = item
            return {
                contact: username,
                image: profile_image,
                f_name,
                l_name,
                chatFile
            }
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
