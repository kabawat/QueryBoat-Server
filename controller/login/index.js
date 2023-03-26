const jwt = require('jsonwebtoken');
const { PRIVATE_KEY_JWT } = process.env;

module.exports.login = async (req, res) => {
    try {
        const { _id } = req.userdata._doc;
        const token = jwt.sign({ _id }, PRIVATE_KEY_JWT);
        if (!token) {
            throw new Error('Token generation failed');
        }
        res.status(200).json({
            status: true,
            message: 'Login success',
            token,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.massage,
        });
    }
};
