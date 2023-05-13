const path = require('path')
const { messageModal, userModal } = require('../')
async function messageStore(req, res) {
    try {
        const { message, msgType, sender, chatFile, receiver } = req.body
        const rootDir = path.dirname(require.main.filename);
        let msgData = { message, msgType, sender, chatFile }
        if (msgType === 'text') {
            dataStore(msgData, receiver, res)
        } else {
            const { file } = req?.files
            const fileMimeType = file.mimetype;
            const origin_name = file?.name.split(' ').join('-')
            const filename = `${new Date().getTime()}${origin_name}`
            let file_path = ''
            let saveFile = ''

            if (file?.length) {
                throw new Error('multiple files not allowed')
            }
            if (msgType === 'image') {
                const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only image files are allowed');
                }

                saveFile = path.join(rootDir, `public/image/${filename}`);
                file_path = `/image/${filename}`;
            }
            if (msgType === 'video') {
                const allowedFileTypes = ['video/mp4',];
                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only video files are allowed');
                }

                saveFile = path.join(rootDir, `public/video/${filename}`);
                file_path = `/video/${filename}`;
            }
            if (msgType === 'audio') {
                const allowedFileTypes = ['audio/mpeg', 'audio/mp3'];
                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only audio files are allowed');
                }
                saveFile = path.join(rootDir, `public/audio/${filename}`);
                file_path = `/audio/${filename}`;
            }
            if (msgType === 'pdf') {
                const allowedFileTypes = ['application/pdf'];
                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only pdf files are allowed');
                }
                saveFile = path.join(rootDir, `public/pdf/${filename}`);
                file_path = `/pdf/${filename}`;
            }

            const Newdata = { ...msgData, file: file_path }
            file.mv(saveFile);
            dataStore(Newdata, receiver, res)
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error?.message,
        })
    }
}

module.exports = messageStore

async function dataStore(msgData, receiver, res) {
    try {
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
