const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 5011 })

wss.on('connection', function connection(ws) {
    console.log('conected')
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something3');
});