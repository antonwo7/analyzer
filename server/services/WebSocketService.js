const WebSocket = require('ws');

class WebSocketService {
    constructor() {
        this.url = 'ws://127.0.0.1:' + process.env.WS_PORT
    }

    init = () => {
        if (!this.url) return;
        this.ws = new WebSocket(this.url)
    }

    sendOnOpenAndClose = (data) => {
        if (!this.ws) return;
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify(data))
            this.ws.close()
        })

        // ws.on('message', function (data, isBinary) {
        //     const message = isBinary ? data : data.toString();
        //     console.log('received from wss', message);
        // });
    }
}

module.exports = WebSocketService