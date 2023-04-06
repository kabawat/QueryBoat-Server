const mongoose = require('mongoose')
// mongoose.set('strictQuery', true);
const URL = `mongodb+srv://QueryBoat:ty9we3ys86@queryboat.04hkymt.mongodb.net/QueryBoat?retryWrites=true&w=majority`
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connect')
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
    status: {
        type: Boolean,
        default: false,
    },
    chatID: {
        type: String,
    },
    token: String,
    profile_image: String
}, { timestamps: true })


// user Chat table 
const chatTable = new mongoose.Schema({
    image: {
        type: String,
        require
    },
    sender: {
        type: String,
        require
    },
    receiver: {
        type: String
    },
}, { timestamps: true })

const chatModal = new mongoose.model('chatList', chatTable)
const userModal = new mongoose.model('userdata', userSchema)

module.exports = { userModal, chatModal }