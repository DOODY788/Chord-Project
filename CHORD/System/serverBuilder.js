const express = require("express");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
let room = {};
const port  = 8000 || process.env.port;

const server = http.createServer(app)
let limit = 0;
const users = {};

app.use(express.static(path.join(__dirname,"../MainFrontEnd")))
app.get('/', (req, res) => {
    res.status(200);
    res.send('Main.html');
});
//Templates
app.set('view engine','pug')
app.set('views',path.join(__dirname,'../views'))

// Endpoints
app.get(`/enterRoom`,(req,res)=>{
    let roomname = req.query.rcode;
    // for(let i = 0;i<room.length;i++){
    //     if(roomname == room[i]){
    //         app.get(`/enterRoom/${room[i]}`,(req,res)=>{
    //             const param = {'link':'/socket.io/socket.io.js'};
    //             res.status(200).render('index.pug',param);
    //         })
    //         querryHandler = i;
    //         res.redirect(`/enterRoom/${roomname}`);
    //     }

    // }
    window.open('','window','_blank');
})

app.get('/createRoom',(req,res)=>{
    let serverport = req.query.rcode;
    room[req.query.rcode] = req.query.rname;
    // res.send('Your room is been created. Go to the main page and enter to your room ')
    res.redirect('/');
    console.log(room);

    const chatserver = express();
    chatserver.use(express.static(path.join(__dirname,"../chatend/")))
    chatserver.set('view engine','pug')
    chatserver.set('views',path.join(__dirname,'../views'))

    chatserver.get('/',(req,res)=>{
        const chatparam = {'link':'/socket.io/socket.io.js'};
        res.status(200).render('index.pug',chatparam);
    })
    roomserver = http.createServer(chatserver);
    const io  = socketio(roomserver);

    const currentUsers = {};

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
            limit -= 1;
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
    chatserver.use(express.static(path.join(__dirname +'/FrontEnd')));
    chatserver.use('/css',express.static(__dirname+'/css'));
    chatserver.use(express.static(__dirname+'notify.wav'));
    
    chatserver.get('/',(req,res)=>{
        res.send(`hello user this is a server on ${serverport}`);
    })
    roomserver.listen(serverport,()=>{
        console.log('server is running at ',serverport)
    })
})



// app.get('*',(req,res)=>{
    //     res.status(200).render('404.pug');
// })
server.listen(port,()=>{console.log('Server is running at',port)});