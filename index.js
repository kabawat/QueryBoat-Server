const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const { userModal } = require('./controller')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://socket-client.onrender.com']
    }
})

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
const socketTableUpdate = async (username, socket) => {
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