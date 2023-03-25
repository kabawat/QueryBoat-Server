const { Router } = require('express')
const router = Router()
const { setOpt } = require('../controller/signup/sendOpt')
const { verifyOpt } = require('../controller/signup/verifyopt')
const { signup } = require('../middleware/signup')
const { registration } = require('../controller/signup')
router.get('/', (req, res) => {
    res.status(200).json({
        massage: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})
router.post('/sendopt', setOpt)
router.post('/verify-email', verifyOpt)
router.post('/registration', signup, registration)

module.exports = router