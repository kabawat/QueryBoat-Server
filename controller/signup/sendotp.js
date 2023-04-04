const { userModal } = require("..");
const nodemailer = require("nodemailer");
const { EMAIL_PASSWORD, EMAIL_USER } = process.env;

const sendEmail = (transport, mailoption, res) => {
    transport.sendMail(mailoption, (error, result) => {
        if (error) {
            res.status(500).json({
                message: error,
                status: false,
            });
        } else {
            res.status(200).json({
                status: true,
                message: `send OTP on ${mailoption.to}`,
            });
        }
    });
};

module.exports.send_otp = async (req, res) => {
    try {
        const { email } = req.body;
        // Create email transport
        const transport = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });

        // Generate OTP
        const digits = "0123456789";
        let otp = "";
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }

        // Construct email options
        const username = email.split("@");
        const mailoption = {
            from: EMAIL_USER,
            to: email,
            subject: "email verification",
            html: `<p>your verification otp is <b>${otp}</b></p>`,
        };

        // Check if user exists
        if (req?.email_data) {
            // Update existing user
            const update = await userModal.updateOne(
                { email },
                {
                    email,
                    username: `${username[0]}${otp}`,
                    password: otp,
                }
            );
            if (update.modifiedCount !== 1) {
                throw new Error("Internal server error");
            }
        } else {
            // Create new user
            const userData = new userModal({
                email,
                username: `${username[0]}${otp}`,
                password: otp,
            });
            await userData.save();
        }

        // Send email with OTP
        sendEmail(transport, mailoption, res);
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};