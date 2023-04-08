const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();

const port  = 3000 || process.env.port;

const server = http.createServer(app)
const io  = socketio(server);
let limit = 0;
const users = {};

io.on('connection',socket=>{
    socket.on('user-joined',name=>{
        if(limit<=5){
            users[socket.id] = name;
            limit += 1;
            console.log(users);
            //broad cast message of joining
            socket.broadcast.emit('notify',`${name} has joined the chat`);
            socket.emit('notify',`Welcome ${name} ;)`);
        }
        else{
            socket.emit('room-full','The room is completely filled, try when there is space in the room');
        }
    })

    

    socket.on('disconnect',name=>{
        socket.broadcast.emit('left',`${users[socket.id]}`)
        setTimeout(() => {
            delete users[socket.id]           
        }, 1000);
    })

    socket.on('excludeuser',event=>{
        delete users[socket.id];
        socket.disconnect();
    })


    socket.on('userSentMessage',message=>{
        socket.broadcast.emit('messagesend',message);
    })

    socket.on('userMediasent',message=>{
        socket.broadcast.emit('mediasend',message);
    })

    socket.on('usernameMedia',name=>{
        socket.broadcast.emit('notify',`${name[0]} has shared an ${name[1]}`);
    })
})
app.use(express.static(path.join(__dirname +'/FrontEnd')));
app.use('/css',express.static(__dirname+'/css'));
app.use(express.static(__dirname+'notify.wav'));

server.listen(port,()=>{console.log('Server is running at',port)});