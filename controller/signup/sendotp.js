const { userModal } = require('..')
const nodemailer = require('nodemailer')
const { EMAIL_PASSWORD, EMAIL_USER } = process.env
const sendEmail = (transport, mailoption, res) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            res.status(500).json({
                massage: error,
                status: false,
            })
        } else {
            res.status(200).json({
                status: true,
                massage: `send OTP on ${mailoption.to}`,
            })
        }
    })
}

module.exports.send_otp = async (req, res) => {
    const { email } = req.body
    // email transport 
    const transport = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    })
    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    const mailoption = {
        from: EMAIL_USER,
        to: email,
        subject: 'email verification',
        html: `<p>your verification otp is <b>${otp}</b></p>`
    }

    try {
        const isExists = await userModal.findOne({ email })
        const username = email.split("@")
        const fromData = new userModal({
            email: email,
            otp: otp,
            username: username[0],
            password: otp,
        })

        if (isExists === null) {
            fromData.save().then((result, error) => {
                if (error) {
                    res.status(500).json({
                        status: false,
                        massage: 'Internal server error',
                    })
                } else {
                    sendEmail(transport, mailoption, res)
                }
            })
        } else {
            if (isExists.status) {
                res.status(409).json({
                    status: false,
                    massage: 'Email Already Exists',
                })
            } else {
                const update = await userModal.updateOne({ username: username[0] }, {
                    email: email,
                    otp: otp,
                    username: username[0],
                    password: otp,
                })
                if (update.modifiedCount !== 1) {
                    throw new Error('Internal server error')
                }
                sendEmail(transport, mailoption, res)
            }
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            massage: error.message,
        })
    }
}
