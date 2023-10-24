const http = require('http');
const server = http.createServer();
const socketServer  = require('socket.io')(server, {
    cors: {
      origin: "*", // ou "*" para aceitar de qualquer origem
      methods: ["GET", "POST"] // os métodos HTTP permitidos
    }
  });
const cors = require('cors');


const clients = {};



socketServer.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    clients[socket.id] = socket;
    
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        delete clients[socket.id];
    });
    
    socket.on('signal', (data) => {
        const { targetId, signalData } = data;
        const targetSocket = clients[targetId];
        
        if (targetSocket) {
            targetSocket.emit('signal', {
                senderId: socket.id,
                signalData,
            });
        }
    });
});

server.listen(4000, () => {
    console.log('Server listening on port 4000');
});
