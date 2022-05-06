const WebSocket = require('ws');
const uuid = require('uuid');

var port = 8000; //port to host websocket on

 //local ip address is localhost. connect in game with /connect localhost:PORT. replace port with port specified in code
console.log(`listening on port: ${port}`);
const wss = new WebSocket.WebSocketServer({ port: port });

wss.on('connection', socket => {
    console.log('User connected');
    //Tell Minecraft to send all chat messages. Required once when Minecraft starts
    socket.send(JSON.stringify({
        "header": {
            "version": 1,                     // Use version 1 message protocol
            "requestId": uuid.v4(),           // A unique ID for the request
            "messageType": "commandRequest",  // This is a request ...
            "messagePurpose": "subscribe"     // ... to subscribe to ...
        },
        "body": {
            "eventName": "PlayerMessage"
        }
    }));

    // // When MineCraft sends a message (e.g. on player chat), act on it.
    socket.on('message', packet => {
        const res = JSON.parse(packet);

        console.log(res); //logs packet info

        if ((res.header.eventName == 'PlayerMessage')) {
            let sender = res.body.sender;
            let message = res.body.message;
            console.log(`${sender}: ${message}`)
        }
    });
});