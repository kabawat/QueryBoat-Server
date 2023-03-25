const { userModal } = require('../')

module.exports.verifyOpt = async (req, res) => {
    const { opt, email } = req.body
    if (opt && email) {
        try {
            const isExist = await userModal.findOne({ email })
            if (isExist) {
                if (isExist.opt === opt) {
                    const update = await userModal.updateOne({ email, opt }, {
                        opt: opt,
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
