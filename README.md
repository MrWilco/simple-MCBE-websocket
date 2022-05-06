# simple-MCBE-websocket
A simple websocket example for Minecraft Bedrock Edition.  A websocket server for Minecraft can be used to communicate between game and external sources.  The most popular use is creating a chat link between Minecraft and Discord.

## Setup
1. Create a new file called `package.json`
2. Inside `package.json` type `{}`
3. Open terminal and run `npm i ws` and `npm i uuid`
Note: Make sure you are using commonjs

## Basic Script
```js
const WebSocket = require('ws');
const uuid = require('uuid');

const port = 8000; //port to host websocket on

 //local ip address is localhost. connect in game with /connect localhost:PORT. replace PORT with port specified in code
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
```

## Usage
1. In Minecraft, run the command `/connect localhost:8000` (8000 is default port. You can change it in the script)
2. Type a message in chat

## Terminal Output
 ```js
 {
  body: { message: 'Test', sender: 'Wilco2933', type: 'chat' },
  header: {
    eventName: 'PlayerMessage',
    messagePurpose: 'event',
    version: 16777216
  }
}
```
## Event Names
[Event Subscribe](https://gist.github.com/jocopa3/5f718f4198f1ea91a37e3a9da468675c) Credit to: [jocopa3](https://gist.github.com/jocopa3)
