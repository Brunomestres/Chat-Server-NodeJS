import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import './config/db'
import { userRoutes } from './routes/user'
const app = express();
const server = createServer(app);
const sockerServerPort = 8000;
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.json())
app.use('/api',userRoutes)
const clients: any = {};

const getUniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

io.on('connection', (socket) => {
  console.log('a user connected');
});



io.on("request", function (request) {
  var userID = getUniqueId();
  console.log(
    new Date() + "Recebido uma nova conexão da origem " + request.origin + "."
  );

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log(
    "conectado: " + userID + " em " + Object.getOwnPropertyNames(clients)
  );

  connection.on("message", function (message: any) {
    if (message.type === "utf8") {
      console.log("Messagem recebida: ", message.utf8Data);
      for (let key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log("Mensagem enviada para: ", clients[key]);
      }
    }
  });
});

server.listen(sockerServerPort, () =>
  console.log(`Listening on port: ${sockerServerPort}`)
);
