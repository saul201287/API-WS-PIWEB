/*
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

require("dotenv").config();
const { verifyToken } = require("./auth.middleware");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = app.listen(port, () => {
  console.log(`API corriendo en el puerto ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  verifyToken(socket, next);
});

io.use((socket, next) => {
  const id_user = socket.handshake.query.id_user;
  
  if (!id_user) {
    return next(new Error("Falta el id_user"));
  }
  socket.id_user = id_user;
  next();
});

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id_user);

  socket.join(socket.id_user);

  socket.on("data", (data) => {
    console.log("Datos recibidos:", data);
    const { id_user, consumo_kwh, whs, ampers, voltaje } = data;
    io.to(id_user).emit("datas", {
      id_user,
      consumo_kwh,
      whs,
      ampers,
      voltaje,
    });
  });

  socket.on("notification-alert", (data) => {
    console.log("Notificación recibida:", data);
    const { id_user, tipo, data: message } = data;

    io.to(id_user).emit("notification-alerts", {
      id_user,
      tipo,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id_user);
  });
});
*/

const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

require("dotenv").config();
const { verifyToken } = require("./auth.middleware");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: "*" }));

const optionsHTTPS = {
  key: fs.readFileSync(String(process.env.RUTA_KEY)),
  cert: fs.readFileSync(String(process.env.RUTA_CERTIFICADO)),
};

const server = https.createServer(optionsHTTPS, app);

server.listen(port, () => {
  console.log(`API corriendo en el puerto ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  verifyToken(socket, next);
});

io.use((socket, next) => {
  const id_user = socket.handshake.query.id_user;

  if (!id_user) {
    return next(new Error("Falta el id_user"));
  }
  socket.id_user = id_user;
  next();
});

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id_user);

  socket.join(socket.id_user);

  socket.on("data", (data) => {
    console.log("Datos recibidos:", data);
    const { id_user, consumo_kwh, whs, ampers, voltaje } = data;
    io.to(id_user).emit("datas", {
      id_user,
      consumo_kwh,
      whs,
      ampers,
      voltaje,
    });
  });

  socket.on("notification-alert", (data) => {
    console.log("Notificación recibida:", data);
    const { id_user, tipo, data: message } = data;

    io.to(id_user).emit("notification-alerts", {
      id_user,
      tipo,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id_user);
  });
});
