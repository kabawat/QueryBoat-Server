const mongoose = require('mongoose')
// mongoose.set('strictQuery', true);
const URL = `mongodb+srv://QueryBoat:ty9we3ys86@queryboat.04hkymt.mongodb.net/QueryBoat?retryWrites=true&w=majority`
// const URL = `mongodb://127.0.0.1:27017/query_boat`
mongoose.connect(URL, {
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
    // contactList: [{ type: String }],
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

userSchema.index({ "contactList.phone": 1 }, { unique: true, sparse: true });

const userModal = new mongoose.model('userdata', userSchema)

module.exports = { userModal }