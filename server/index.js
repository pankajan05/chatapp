const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUserInRoom} = require('./users');

const PORT = process.env.PORT || 5000

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    //emit message when the user join to the room
    socket.on('join', ({name,room}, callback) => {
        const {error, user } = addUser({id:socket.id, name, room});

        if(error) return callback(error);

        socket.emit('message', {user:'admin', text:'${user.name} welcome to the room ${user.room}'});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: '${user.name}, has joined!'});


        socket.join(user.room);

        callback();
    });

    //emit when the user type
    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message',{ user: user.name, text: message});

        callback();
    });


    //when user leave emit this message
    socket.on('disconnect', () => {
        console.log('User had left..');
    });
});

//routing 
app.use(router);

server.listen(PORT, () => console.log('Server has started on port ${PORT}'));
