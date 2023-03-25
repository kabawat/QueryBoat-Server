const nodemailer = require('nodemailer')
const { userModal } = require('../')
const jwt = require('jsonwebtoken')
const path = require('path')
const { EMAIL_USER, EMAIL_PASSWORD, PRIVATE_KEY_JWT } = process.env;
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
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        })
        const mailoption = {
            from: EMAIL_USER,
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

        const rootDir = path.dirname(require.main.filename);
        let profile_image = path.join(rootDir, `public/user/profile.png`)
        if (req?.files?.profile) {
            if (req.files.profile.length) {
                throw new Error('multiple files not allowed')
            } else {
                const { profile } = req.files;
                const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                const fileMimeType = profile.mimetype;

                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only image files are allowed');
                }

                const filename = `${username}-${new Date().getTime()}${path.extname(profile.name)}`
                const saveFile = path.join(rootDir, `public/user/${filename}`);
                profile.mv(saveFile);
                profile_image = saveFile;
            }
        }

        const update = await userModal.updateOne({ email: email }, {
            username,
            otp: null,
            status: true,
            password,
            profile_image
        })

        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
        const token = jwt.sign({ email, username }, PRIVATE_KEY_JWT)
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
