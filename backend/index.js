const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require("socket.io").listen(server)
const port = 3000

const users = {}

io.on("connection", socket => {
    console.log("a user has just connected :D");

    users[socket.id] = socket.id
    socket.broadcast.emit("user connected", users[socket.id])

    socket.on("chat message", msg =>{
        io.emit("chat message", {msg : msg, name : users[socket.id]})
    })
    socket.on("disconnect", () =>{
        socket.broadcast.emit("user disconnected", users[socket.id])
        delete users[socket.id]
    })
})

server.listen(port, () => console.log("server running on port : "+port))

