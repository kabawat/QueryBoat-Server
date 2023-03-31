const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const path = require('path')
const dot = require('dotenv').config()
const router = require('./router')
const cors = require('cors')
const port = process.env.PORT || 2917
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.use(fileUpload())
app.use('/user', express.static(path.join(__dirname, 'public/user')))
app.use(router)

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})