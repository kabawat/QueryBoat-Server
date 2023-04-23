const nodemailer = require('nodemailer')
const { userModal } = require('../')

const { EMAIL_USER, EMAIL_PASSWORD } = process.env
const transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

const sendEmail = (transport, mailoption, res, msg) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error,
                status: false,
            });
        } else {
            res.status(200).json({
                status: true,
                message: msg,
            });
        }
    });
};
// Forgot Password
function passwordValidtion(password) {
    // 1. if password is empty 
    if (!password) {
        return "password are required"
    }

    // 2. if password  is only space 
    if (password.trim().length === 0) {
        return "invalid password"
    }

    // 3. if password length < 6 
    if (password.trim().length < 6) {
        return "password length must be 6 characters"
    }
    return false
}

// password validtion 
function emailbody(password) {
    return `
        <style>
            .container {
                background-color: #fff;
                border-radius: 10px;
                margin: 30px auto;
                max-width: 600px;
                padding: 20px;
            }
            .headeremail {
                background-color: #0171d3;
                border-radius: 10px 10px 0 0;
                color: #fff;
                padding: 20px;
                text-align: center;
                margin: 0px 0px 10px
            }
            .headeremail h1{
                color: #fff;
            }
            .success {
                color: #4CAF50;
                font-weight: bold;
                margin-top: 30px;
                text-align: center;
            }
            .footer {
                color: #888;
                font-size: 12px;
                margin-top: 30px;
                text-align: center;
            }
        </style>
        <div class="container">
            <div class="headeremail">
                <h1>Password Reset Confirmation</h1>
            </div>
            <p>Hi there,</p>
            <p>We're writing to let you know that your password has been successfully reset. If you didn't make this request, please contact us immediately.</p>
            <p>If you did make this request, please use your new password to log in:</p>
            <p><strong>New Password:</strong> ${password}</p>
            <p>We recommend that you change your password again to something unique and secure.</p>
            <div class="success">
                <p>Your password has been reset!</p>
            </div>
            <p>If you have any questions or concerns, please contact us to <a href="http://wa.me/916377576922?text=Hello Query Boat team! >click here.</a><p>
            <div class="footer">
                <p>This email was sent to you because you requested a password reset. If you didn't make this request, please contact us immediately.</p>
                <p><a href="https://query-boat.onrender.com">Query Boat</a></p>
            </div>
        </div> 
    `
}

// forgot OTP 
module.exports.ForgotOtp = async (req, res) => {
    const { email } = req.body
    try {
        const { status } = req.email_data
        if (!status) {
            throw new Error('invalid email')
        }

        // Generate OTP
        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: "Email Verification",
            html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            color: #333;
                            text-align: center;
                            padding: 30px;
                        }
                        h1 {
                            font-size: 32px;
                            margin-bottom: 20px;
                        }
                        p {
                            font-size: 18px;
                            margin-bottom: 10px;
                        }
                        .otp {
                            display: inline-block;
                            background-color: #fff;
                            border: 1px solid #ccc;
                            padding: 10px;
                            font-size: 24px;
                            border-radius: 5px;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Email Verification</h1>
                    <p>Use the following code to verify your email:</p>
                    <div class="otp">${otp}</div>
                    <p>This code is valid for 10 minutes.</p>
                </body>
          </html>
            `,
        };

        const update = await userModal.updateOne({ email }, { password: otp, });
        if (update.modifiedCount !== 1) {
            throw new Error("Internal server error");
        }

        sendEmail(transport, mailOptions, res, `OTP successfuly send on ${mailOptions.to}`);

    } catch (error) {
        res.status(500).json({
            status: false,
            data: [],
            message: error?.message
        })
    }
}

// forgot Password 
module.exports.ForgotPassword = async (req, res) => {
    const { status } = req?.email_data
    const { password, email } = req.body
    try {
        if (!status) {
            throw new Error('invalid email')
        }
        const isPwd = passwordValidtion(password)
        if (isPwd) {
            throw new Error(isPwd)
        }

        const isUpadate = await userModal.updateOne({ email }, { password })
        if (isUpadate.modifiedCount !== 1) {
            throw new Error('Internal server error');
        }

        // setup email data with unicode symbols
        let mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: "Password Reset Confirmation",
            html: emailbody(password)
        };
        sendEmail(transport, mailOptions, res, `Password reset successfuly`);
    } catch (error) {
        res.status(409).json({
            status: false,
            data: [],
            message: error?.message
        })
    }
}