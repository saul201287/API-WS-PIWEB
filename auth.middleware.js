const jwt = require("jsonwebtoken");

async function createToken(id_user) {
  try {
    let secret = process.env.SECRET_KEY_TOKEN;
    const payload = { id_user };
    return jwt.sign(payload, secret, { expiresIn: "1h" });
  } catch (error) {
    console.error(error);
    return "error: " + error;
  }
}

async function verifyToken(socket, next) {
  const token = socket.handshake.auth.token;
  console.log("Token recibido:", token);
  if (!token) {
    return next(new Error("Token de autenticación no proporcionado"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    socket.decoded = decoded;
    next();
    console.log("Token decodificado:", decoded);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const decodedExpired = jwt.verify(token, process.env.SECRET_KEY_TOKEN, { ignoreExpiration: true });
        const newToken = await createToken(decodedExpired.id_user);
        socket.handshake.auth.token = newToken;
        const decodedNew = jwt.verify(newToken, process.env.SECRET_KEY_TOKEN);
        socket.decoded = decodedNew;
        next();
      } catch (innerError) {
        console.log(innerError);
        return next(new Error("Error al renovar el token de autenticación"));
      }
    } else {
      console.log(error);
      return next(new Error("Token de autenticación inválido"));
    }
  }
}

module.exports = { verifyToken };
