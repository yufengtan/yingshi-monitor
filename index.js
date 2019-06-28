const { server } = require('./server')
require('./app')

server.listen(8100, () => console.log('the Server is listening on 8100'))
server.on('connection', function (socket) {
    console.log("A new connection was made by a client.")
    socket.setTimeout(30 * 1000)
    // 30 second timeout. Change this as you see fit.
})