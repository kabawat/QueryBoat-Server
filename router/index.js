const { Router } = require('express')
const router = Router()
const { send_otp } = require('../controller/signup/sendotp')
const { verifyOtp } = require('../controller/signup/verifyOtp')
const { signup } = require('../middleware/signup')
const { registration } = require('../controller/signup')
const { verifyLogin } = require('../middleware/login')
const { login } = require('../controller/login')
const { verify, usernameUnique } = require('../middleware/verify')
const { profile } = require('../controller/profile')
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})

// registration
router.post('/sendotp', send_otp)
router.post('/verify-email', verifyOtp)
router.post('/verify-username', usernameUnique)
router.post('/registration', signup, registration)

// login 
router.post('/login', verifyLogin, login)

router.get('/profile/:user', verify, profile)

module.exports = router