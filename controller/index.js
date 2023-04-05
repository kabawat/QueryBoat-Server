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
    chatid: {
        type: String,
    },
    chatID: {
        type: String,
    },
    token: String,
    profile_image: String
}, { timestamps: true })


// user Chat table 
const chatTable = new mongoose.Schema({
    chatID: {
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
    date: {
        type: Date,
        default: Date.now
    }
})

const chatSocket = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    chatID: {
        type: String,
        required: true
    }
})


const chatModal = new mongoose.model('chatList', chatTable)
const socketModal = new mongoose.model('socketIds', chatSocket)
const userModal = new mongoose.model('userdata', userSchema)

module.exports = { userModal, chatModal, socketModal }