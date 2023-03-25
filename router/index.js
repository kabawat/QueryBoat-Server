const { Router } = require('express')
const router = Router()
const { setOpt } = require('../controller/signup/sendOpt')
router.get('/', (req, res) => {
    res.status(200).json({
        massage: 'wellcome to Query Boat',
        status: true,
        data: []
    })
})
router.post('/sendopt', setOpt)
module.exports = router