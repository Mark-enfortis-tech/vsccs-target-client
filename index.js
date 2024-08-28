const net = require('node:net');
const dgram = require('dgram');
const querystring = require('querystring');

/*
this app will only need to listen to incoming messages, 
When a message is received the app will need to form a transmission frame 
and send to the target.
The message will need to be formed into a protocol appropriate for the target
The incoming message will provide the message plus the protocol to use.

Need to send a response back to the vsccs server indicating command received.

*/


// msgServer object - handles incoming commands
const targetClient = net.createServer((socket) => {
  // 'connection' listener.
  console.log('msg client connected');
  // myTimer.start();


  socket.on('end', () => {
    console.log('cmd handler disconnected');
  });

  // receive command from UI
  socket.on('data', (data) => {  
    console.log('target client received: ', data.toString());
    myObj = JSON.parse(data);
    var cmdMap = new Map(Object.entries(myObj));
    console.log('commandMap: ', cmdMap);

    // wait 1 second and send response to ack handler
    
    const respData = {
      "cmd_id": commandMap.get("cmd_id"),
      "time_sent" : commandMap.get("time_sent")
    };

    sendData(respData);

  }); 
});

targetClient.on('error', (err) => {
  throw err;
});

targetClient.listen(3004, () => {
  console.log('target client waiting for connection...'); 
});


function sendData(respData){
  console.log("running sendData:", respData);

  const internalClient = new net.Socket();

  const remPort = 3006;
  const host = 'localhost';

  // connect to command handler and send command, then close the socket
  internalClient.connect(remPort, host, () => {
    console.log('connected to command handler');
    const respDataStr = JSON.stringify(respData);
    console.log('sending response: ', respDataStr)
    internalClient.write(respDataStr);
    internalClient.end();
  });
}
























