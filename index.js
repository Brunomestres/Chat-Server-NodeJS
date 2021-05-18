const webSocketServer = require('websocket').server;
const http = require('http');
const sockerServerPort = 8000;

const server = http.createServer();
server.listen(sockerServerPort);
console.log('Rodando na porta ', sockerServerPort);

const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

const getUniqueId = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000 ).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

wsServer.on('request', function(request){
  var userID = getUniqueId();
  console.log((new Date()) + 'Recebido uma nova conexão da origem ' + request.origin + '.');

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('conectado: ' + userID + ' em ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function(message){
    if(message.type === 'utf8')
    {
      console.log('Messagem recebida: ', message.utf8Data);
      for(key in clients)
      {
        clients[key].sendUTF(message.utf8Data);
        console.log('Mensagem enviada para: ', clients[key]);
      }
    }
  });

});
