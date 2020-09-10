const socketio = require('socket.io')
const io = socketio()

const socketApi = { }
socketApi.io = io;

const users = { };

io.on('connection',(socket)=>   {
    console.log('connection')

    socket.on('newUser',(data)=>{
        const defaultdata={
            id: socket.id,
            position:{
                x:0,
                y:0,
            },
        }

        const userData = Object.assign(defaultdata,data)
        users[socket.id] = userData

        socket.broadcast.emit('newUser',users[socket.id])
        console.log(users)

    })

    socket.on('disconnect',()=>{

        socket.broadcast.emit('disUser',users[socket.id])
        delete users[socket.id]
        console.log(users)
    })


})

module.exports =socketApi