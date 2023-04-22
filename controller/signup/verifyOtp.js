const { userModal } = require('..')

module.exports.verifyOtp = async (req, res) => {
    const { otp, email } = req.body
    try {
        if (!otp) {
            throw new Error('otp is required')
        }
        const { password, status } = req?.email_data
        if (password !== otp) {
            throw new Error('invalid otp')
        }
        if (status) {
            throw new Error('user already exists')
        }
        const update = await userModal.updateOne({ email }, {
            password: null,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        res.status(200).json({
            status: true,
            message: 'email verify success',
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message
        })
    }
}
module.exports.forgetVerify = async (req, res) => {
    const { otp, email } = req.body
    try {
        if (!otp) {
            throw new Error('otp is required')
        }
        const { password, status } = req?.email_data
        if (password !== otp) {
            throw new Error('invalid otp')
        }
        if (!status) {
            throw new Error('user not exists')
        }
        const update = await userModal.updateOne({ email }, {
            password: null,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        res.status(200).json({
            status: true,
            message: 'email verify success',
        })
    } catch (error) {
        res.status(409).json({
            status: false,
            message: error.message
        })
    }
}
