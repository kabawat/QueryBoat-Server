require('dotenv').config()
const DB_URL = process.env.DB_URL
const mongoose = require('mongoose')
// mongoose.set('strictQuery', true);
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 30000,
}).then(() => {
    console.log('connect')
})

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    f_name: {
        type: String,
        required: true,
    },

    l_name: {
        type: String,
        required: true,
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
    profile_image: String,
    contactList: [{
        contact: {
            type: String,
            required: true
        },
        chatFile: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: false,
            required: true
        }
    }],
    lastSeen: {
        type: Date,
        default: Date.now()
    },
    isOnline: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    chatFile: {
        type: String,
        required: true,
    },
    sender: {
        required: true,
        type: String,
    },
    message: {
        type: String,
        default: ''
    },
    file: {
        type: String,
        default: ''
    },
    msgType: {
        type: String,
        default: 'text'
    },
    time: {
        type: Date,
        default: Date.now
    }
})
userSchema.index({ "contactList.phone": 1 }, { unique: true, sparse: true });

const userModal = new mongoose.model('user-profile', userSchema)
const messageModal = new mongoose.model('msgStore', messageSchema)

module.exports = { userModal, messageModal }