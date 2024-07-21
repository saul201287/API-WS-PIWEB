const jwt = require("jsonwebtoken");

async function createToken(id_user) {
  try {
    let secret = process.env.SECRET_KEY_TOKEN;
    const payload = { id_user };
    return sign(payload, secret, { expiresIn: "1h" });
  } catch (error) {
    console.error(error);
    return "error: " + error;
  }
}

async function verifyToken(socket, next) {
  const token = socket.handshake.auth.token;
  console.log(token);
  if (!token) {
    return next(new Error("Token de autenticación no proporcionado"));
  }
  try {
    const data2 = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    socket.decoded = data2;
    next();
    console.log(data2);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const newToken = await createToken(
        verify(token, secret, { ignoreExpiration: true }).id_user
      );
      socket.decoded = newToken;
      next();
    } else {
      console.log(error);
      return next(new Error("Token de autenticación inválido"));
    }
  }
}

module.exports = { verifyToken };
