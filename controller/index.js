const mongoose = require('mongoose')
const URL = `mongodb+srv://QueryBoat:ty9we3ys86@queryboat.x19vz8s.mongodb.net/QueryBoat?retryWrites=true&w=majority`
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    token: String,
    profile_image: String
}, { timestamps: true })
const userModal = new mongoose.model('userdata', userSchema)
module.exports = { userModal }