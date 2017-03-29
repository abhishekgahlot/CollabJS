const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocketServer = require('ws').Server; // for extreme performance use uws later

// For logging
const winston = require('winston');

const config = require('./config');
const main = require('./server/main');
const websocket = require('./server/websocket');

// Required initializations.
const app = express();
const server = http.createServer();
const wss = new WebSocketServer({server});

// Middlewares
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.get('/', (req, res) => {
  res.send({app: 'Scrite Server'});
});


// start server and handle websockets

var u = 0;
wss.on('connection', (ws) => {
  console.log(u++)
  ws.on('message', (message) => {
    websocket.handle(message, ws);
  });
});

server.on('request', app);
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
