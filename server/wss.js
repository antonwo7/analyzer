require('dotenv').config()
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: process.env.WS_PORT })

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function (client) {
        client.send(msg);
    });
};

wss.on('connection', function connection(ws) {

    ws.on('error', console.error)

    ws.on('message', function (data, isBinary) {
        data = isBinary ? data : data.toString()

        try {
            const jsonData = JSON.parse(data)
            if (!jsonData) return;
            wss.broadcast(data);

        } catch (e) {
            if (!(e instanceof Error)) {
                e = new Error(e)
            }
            console.error(e.message)
        }
    })
})