const { userModal } = require('../../controller/')
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY_JWT } = process.env;
module.exports.googleAuth = async (req, res) => {
    try {
        const { email, username, password, profile_image } = req.body
        const isExist = await userModal.findOne({ email, status: true }, 'email username status')
        const token = jwt.sign({ email }, PRIVATE_KEY_JWT);
        if (!token) {
            throw new Error('Token generation failed');
        }
        if (isExist) {
            const { email, username, status } = isExist
            const updateResult = await userModal.updateOne({ email, status: true }, { token });
            if (updateResult.modifiedCount !== 1) {
                throw new Error('Internal server error');
            }
            res.status(200).json({
                status: true,
                message: 'Login successful',
                token,
                username
            });
        } else {
            const dataModal = new userModal({
                email,
                token,
                username,
                password,
                profile_image,
                status: true,
                contactList: [],
            })
            const isSave = await dataModal.save()
            res.status(200).json({
                status: true,
                message: 'registration successful',
                token,
                username
            });
        }

    } catch (error) {
        res.status(409).json({
            status: false,
            message: error?.message,
        });
    }
}