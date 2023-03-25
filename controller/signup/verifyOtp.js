const { userModal } = require('..')

module.exports.verifyOtp = async (req, res) => {
    const { otp, email } = req.body
    if (otp && email) {
        try {
            const isExist = await userModal.findOne({ email })
            if (isExist) {
                if (isExist.otp === otp) {
                    const update = await userModal.updateOne({ email, otp }, {
                        otp: otp,
                    })
                    if (update.modifiedCount !== 1) {
                        throw new Error('Something went wrong')
                    }
                    res.status(200).json({
                        status: true,
                        massage: 'email verify success',
                    })

                } else {
                    throw new Error('Enter valid OTP')
                }

            } else {
                throw new Error('invalid credentials')
            }
        } catch (error) {
            res.status(401).json({
                status: false,
                message: error.message
            })

        }
    } else {
        res.send('invalid OTP')
    }
}
