const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:5011');

ws.on('error', console.error);

ws.on('open', function open() {
    ws.send('sending from client 2');
});

ws.on('message', function message(data) {
    console.log('received client 2: %s', data);
});