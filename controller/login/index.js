const jwt = require('jsonwebtoken');
const { userModal } = require('../');
const { PRIVATE_KEY_JWT } = process.env;

module.exports.login = async (req, res) => {
    try {
        const { email, username, password, _id } = req.userdata._doc;
        const token = jwt.sign({ _id }, PRIVATE_KEY_JWT);
        if (!token) {
            throw new Error('Token generation failed');
        }
        const updateResult = await userModal.updateOne({ email, password, status: true }, { token });
        if (updateResult.modifiedCount !== 1) {
            throw new Error('Internal server error');
        }
        res.status(200).json({
            status: true,
            message: 'Login success',
            token,
            username
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
