const { Router } = require('express')
const router = Router()
const { send_otp } = require('../controller/signup/sendotp')
const { verifyOtp } = require('../controller/signup/verifyOtp')
const { signup } = require('../middleware/signup')
const { registration } = require('../controller/signup')
router.get('/', (req, res) => {
    res.status(200).json({
        massage: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})
router.post('/sendotp', send_otp)
router.post('/verify-email', verifyOtp)
router.post('/registration', signup, registration)

module.exports = router