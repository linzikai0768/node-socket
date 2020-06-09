var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
var userCode = require('./src/js/mysql')

io.on('connection', socket => {
  io.emit('chat message', 'msg')
})
http.listen(3030, () => {
  console.log('http://localhost:3030')
})
