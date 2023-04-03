const { Router } = require('express')
const router = Router()
const { send_otp } = require('../controller/signup/sendotp')
const { verifyOtp } = require('../controller/signup/verifyOtp')
const { signup } = require('../controller/signup')
const { verifyLogin } = require('../middleware/login')
const { login } = require('../controller/login')
const { verify, isUsername, isEmail, uniqueUsername, emailData, uniqueEmail } = require('../middleware/verify')
const { profile } = require('../controller/profile')
const { update_profile_picture } = require('../controller/profile/update_profile_picture')
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})

// registration
router.post('/sendotp', uniqueEmail, send_otp)
router.post('/verify-email', verifyOtp)
router.post('/signup', isEmail, isUsername, uniqueUsername, emailData, signup)
router.post('/update_profile_picture', isEmail, emailData, update_profile_picture)

// login 
router.post('/login', verifyLogin, login)

router.get('/profile/:user', verify, profile)

module.exports = router