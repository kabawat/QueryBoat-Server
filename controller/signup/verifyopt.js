const { userModal } = require('../')
module.exports.verifyOpt = async (req, res) => {
    const { opt, email } = req.body
    if (opt && email) {
        const isExist = await userModal.findOne({ email, otp })
        console.log(isExist)
        res.send("here")
    } else {
        res.send('invalid OTP')
    }
}