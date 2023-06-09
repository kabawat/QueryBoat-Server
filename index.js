const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const { userModal } = require('./controller')
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
    { origin: ['http://localhost:3000', 'https://query-boat.onrender.com', 'https://blissful-shadow-99347.pktriot.net'] }
))
app.use(bodyParser.json())
app.use(fileUpload())
app.use('/user', express.static(path.join(__dirname, 'public/user')))
app.use('/image', express.static(path.join(__dirname, 'public/image')))
app.use('/video', express.static(path.join(__dirname, 'public/video')))
app.use('/pdf', express.static(path.join(__dirname, 'public/pdf')))
app.use('/audio', express.static(path.join(__dirname, 'public/audio')))
app.use(router)


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://query-boat.onrender.com', 'https://blissful-shadow-99347.pktriot.net']
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
            lastSeenUpadate(socket.id)
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
            lastSeen: new Date(),
            isOnline: true,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
    } catch (error) {

    }
}

async function lastSeenUpadate(chatID) {
    try {
        const update = await userModal.updateOne({ chatID }, {
            lastSeen: new Date(),
            isOnline: false,
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
    } catch (error) {

    }
}
async function sendMessageHandle(data, io) {
    const { sender, chatID, chatFile } = data
    const chat = {
        receiver: sender.username,
        chatID: sender?.chatID,
        chatFile
    }
    io.to(chatID).emit('Received Message', chat)
}