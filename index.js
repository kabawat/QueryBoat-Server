const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const { socketModal } = require('./controller')
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
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });

        // when new user join Query Boat chat 
        socket.on('New User Join', data => {
            socketTablehandler(data)
        })

        // when user refresh the page 
        socket.on('refresh', data => {
            socketTableUpdate(data)
        })

    });
};

// server listen 
server.listen(port, () => {
    startSocketServer()
    console.log(`http://localhost:${port}`)
})


// insert new data 
const socketTablehandler = async (data) => {
    try {
        const modal = new socketModal({
            username: data.username,
            [data.username]: data.id
        })
        await modal.save()
    } catch (error) {
        console.log(error.message)
    }
}

// update 
const socketTableUpdate = async (data) => {
    try {
        const update = await socketModal.updateOne({ username: data.username }, {
            [data.username]: data.id
        })
        if (update.modifiedCount !== 1) {
            throw new Error('Something went wrong')
        }
    } catch (error) {

    }
}