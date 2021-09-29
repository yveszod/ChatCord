const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const utils = require('./utils/messages');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);

const botName = 'ChatCord Bot'

const io = socketio(server);
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        
        const user = utils.userJoin(socket.id, username, room);
        
        socket.join(user.room);

        // Welcome User
        socket.emit('msg', utils.formatMsg(botName, 'Welcome to ChatCord'));
        // Alert Joined User
        socket.broadcast.to(user.room).emit('msg', utils.formatMsg(botName, `${user.username} has joined ${user.room}`));
        // Send Users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: utils.getRoomUsers(user.room)
        });
    });
    socket.on('Chat Message', msg => {

        const user = utils.getCurrentUser(socket.id);

        io.to(user.room).emit('msg', utils.formatMsg(user.username, msg));
    });
    socket.on('disconnect', () => {
        const user = utils.userLeave(socket.id);

        if( user ){
            console.log(user.room);
            io.to(user.room).emit('msg', utils.formatMsg(botName, `${user.username} has left the room`));
                   // Send Users
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: utils.getRoomUsers(user.room)
            });
        }
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));