const nodemailer = require('nodemailer')
const { userModal } = require('../')
const jwt = require('jsonwebtoken')
const privateKey = process.env.PRIVATE_KEY_JWT

const sendEmail = (transport, mailoption, res) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            res.status(500).json({
                massage: error,
                status: false,
            })
        }
    })
}

module.exports.registration = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: 'testbymukesh@gmail.com',
                pass: 'umywypawbwiurzkb'
            }
        })
        const mailoption = {
            from: 'testbymukesh@gmail.com',
            to: email,
            subject: 'confirmation email',
            html: `<div style="font-family: sans-serif; text-align: center;">
            <h1>Welcome to QueryBoat!</h1>
            <p>Hello ${username},</p>
            <p>We're thrilled that you've joined QueryBoat. You can now connect with people around the world and explore new possibilities.</p>
            <p>Your account has been registered with the following details:</p>
            <ul style="list-style-type: none; padding: 0;">
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Username:</strong> ${username}</li>
            </ul>
            <p>Thank you for choosing QueryBoat. We hope you enjoy using our service!</p>
          </div>`
        }
        const update = await userModal.updateOne({ email: email }, {
            username,
            otp: null,
            status: true,
            password,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        const token = jwt.sign({ email, username }, privateKey)
        sendEmail(transport, mailoption, res)
        res.status(200).json({
            status: true,
            massage: 'registration successful',
            token
        })
    } catch (error) {
        res.status(401).json({
            status: false,
            massage: error.message
        })
    }
}
