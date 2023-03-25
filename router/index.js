const { Router } = require('express')
const router = Router()
const { setOpt } = require('../controller/signup/sendOpt')
const { verifyOpt } = require('../controller/signup/verifyopt')
router.get('/', (req, res) => {
    res.status(200).json({
        massage: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})
router.post('/sendopt', setOpt)
router.post('/verify-email', verifyOpt)
module.exports = router