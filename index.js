const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const { userModal, chatModal } = require('./controller')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')
const dot = require('dotenv').config()
const router = require('./router')
const cors = require('cors')
const port = process.env.PORT || 2917
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(
    { origin: ['http://localhost:3000', 'https://query-boat.onrender.com'] }
))
app.use(bodyParser.json())
app.use(fileUpload())
app.use('/user', express.static(path.join(__dirname, 'public/user')))
app.use(router)


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://query-boat.onrender.com']
    }
})

// socket data 
const startSocketServer = () => {
    io.on('connection', (socket) => {
        // when new user join Query Boat chat 
        socket.on('New User Join', username => {
            socketTableUpdate(username, socket)
        })

        // when user refresh the page 
        socket.on('refresh', username => {
            socketTableUpdate(username, socket)
        })

        // chat 
        socket.on('Send Message', data => {
            sendMessageHandle(data, io)
        })

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);

        });
    });
};

// server listen 
server.listen(port, () => {
    startSocketServer()
    console.log(`http://localhost:${port}`)
})


// insert new data 
// update 
async function socketTableUpdate(username, socket) {
    try {
        const update = await userModal.updateOne({ username }, {
            chatID: socket.id,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
    } catch (error) {

    }
}

async function sendMessageHandle(data, io) {
    const { message, time, sender, receiver } = data
    const chat = {
        message,
        time,
        sender: sender?.username,
        receiver: receiver?.username,
    }
    const isExist = await chatModal.findOne({
        sender: sender?.username,
        receiver: receiver?.username
    })
    if (isExist) {
        io.to(sender?.chatID).emit("Received Message", chat)
    } else {
        const newChat = new chatModal({
            image: receiver?.image,
            sender: sender?.username,
            receiver: receiver?.username
        })
        const res = await newChat.save()
        if (res) {
            io.to(sender?.chatID).emit('Received New Chat', chat)
        }
    }
}