const { userModal } = require('../')
const nodemailer = require('nodemailer')

const sendEmail = (transport, mailoption, res) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            console.log(error)
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

module.exports.setOpt = async (req, res) => {
    const { email } = req.body
    // email transport 
    const transport = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: 'testbymukesh@gmail.com',
            pass: 'umywypawbwiurzkb'
        }
    })
    const OPT = Math.floor(Math.random() * 1000000)
    const mailoption = {
        from: 'testbymukesh@gmail.com',
        to: email,
        subject: 'email verification',
        html: `<p>your verification OPT is <b>${OPT}</b></p>`
    }

    try {
        const isExists = await userModal.findOne({ email })
        const username = email.split("@")
        const fromData = new userModal({
            email: email,
            opt: OPT,
            username: username[0],
            password: OPT,
        })

        if (isExists === null) {
            fromData.save().then((result, error) => {
                if (error) {
                    res.status(500).json({
                        status: false,
                        massage: 'internal server error',
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
                    opt: OPT,
                    username: username[0],
                    password: OPT,
                })
                if (update.modifiedCount !== 1) {
                    throw new Error('Something went wrong')
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
