const { Router } = require('express')
const router = Router()
const { send_otp } = require('../controller/signup/sendotp')
const { verifyOtp, forgetVerify } = require('../controller/signup/verifyOtp')
const { signup } = require('../controller/signup')
const { verifyLogin } = require('../middleware/login')
const { login } = require('../controller/login')
const { verify, isUsername, isEmail, uniqueUsername, emailData, uniqueEmail } = require('../middleware/verify')
const profile = require('../controller/profile')
const { update_profile_picture } = require('../controller/profile/update_profile_picture')
const { contact_list, new_chat, individualChat, remove_chat, new_chat_request } = require('../controller/chat')
const { receiver_profile } = require('../controller/profile/receiver_profile')
const { ForgotOtp, ForgotPassword } = require('../controller/forgot')
const { googleAuth } = require('../controller/google-auth')
const { g_uploadFile } = require('../controller/google-drive/upload')
const download = require('../controller/download')
const messageStore = require('../controller/message')
const getMessage = require('../controller/message/get-message')
const deleteMessage = require('../controller/message/delete-message')
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})

// registration
router.post('/sendotp', isEmail, uniqueEmail, send_otp)
router.post('/verify-email', emailData, verifyOtp)
router.post('/signup', isEmail, isUsername, uniqueUsername, emailData, signup)
router.post('/update_profile_picture', verify, isEmail, emailData, update_profile_picture)

router.post('/forgot-otp', isEmail, emailData, ForgotOtp)
router.post('/forgot-password-verify', isEmail, emailData, forgetVerify)
router.post('/forgot-password', isEmail, emailData, ForgotPassword)

// login 
router.post('/login', verifyLogin, login)
router.get('/profile/:user', verify, profile)


// chat 
router.post('/contact_list', verify, emailData, contact_list)
router.post('/new_chat', verify, new_chat)
router.post('/new_chat_request', verify, new_chat_request)
router.get('/chatlist/:sender', verify, individualChat)
router.post('/remove_chat', verify, remove_chat)

// receiver_profile
router.get('/receiver/:receiver', verify, receiver_profile)


// google auth 
router.post('/contact_list', verify, emailData, contact_list)
router.post('/google_signin', googleAuth)

// file upload 
router.post('/upload_file', g_uploadFile)  // google drive
router.get('/download', download)

// message API 
router.post('/send_message', messageStore)
router.post('/get_message', getMessage)
router.post('/delete_message', deleteMessage)
module.exports = router