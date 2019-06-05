// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

//Set up client object.
const CLIENTS = []

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  CLIENTS.push(ws);
  console.log(`Client connected - Total Connections ${CLIENTS.length}`);
  loggedOn();
  ws.on('message', event => {
    let message = JSON.parse(event)
    message.id = uuidv4();
    console.dir(message);
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    CLIENTS.pop();
    console.log(`Client disconnected - Total Connections ${CLIENTS.length}`);
    loggedOn();
  });
});


function loggedOn() {
  let output = {
    type: 'usercount',
    content: CLIENTS.length
  }
  wss.clients.forEach(client => {
    client.send(JSON.stringify(output));
    });
}