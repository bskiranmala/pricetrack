
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

function generateRandomPrice(base) {
    return (base + (Math.random() * 10 - 5)).toFixed(2);
}

let prices = {
    AAPL: 150.00,
    GOOGL: 2800.00,
    MSFT: 310.00
};

setInterval(() => {
    for (let stock in prices) {
        prices[stock] = parseFloat(generateRandomPrice(prices[stock]));
    }
    io.emit('price update', prices);
}, 2000);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('price update', prices);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('Stock price tracker running on port ' + port);
});
