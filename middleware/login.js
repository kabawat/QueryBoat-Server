const { userModal } = require('../controller/');
module.exports.verifyLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = await userModal.findOne({ email, password, status: true });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        req.userdata = { ...user };
        next();
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message,
            data: [],
        });
    }
};
