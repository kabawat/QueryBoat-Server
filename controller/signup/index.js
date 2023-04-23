const nodemailer = require('nodemailer')
const { userModal } = require('../')
const jwt = require('jsonwebtoken')
const { EMAIL_USER, EMAIL_PASSWORD, PRIVATE_KEY_JWT } = process.env;

const sendEmail = (transport, mailoption, res) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error,
                status: false,
            })
        }
    })
}

module.exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body
        const { _id, email, status } = req?.email_data
        if (!req?.body?.password) {
            throw new Error('password is required')
        }
        if (status) {
            throw new Error('user already registered')
        }
        const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        })
        const mailoption = {
            from: EMAIL_USER,
            to: email,
            subject: 'welcome to Query Boat',
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

        const token = jwt.sign({ _id }, PRIVATE_KEY_JWT)
        const update = await userModal.updateOne(
            { email: email },
            {
                $set: {
                    username: username,
                    status: true,
                    password: password,
                    token,
                }
            }
        );
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        sendEmail(transport, mailoption, res)
        res.status(200).json({
            status: true,
            message: 'registration successful',
            token,
            username
        })
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message
        })
    }
}
