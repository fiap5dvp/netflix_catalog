const AuthenticationService = require("../services/AuthenticationService");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) return res.status(401).send("Token inválido");

  const user = await AuthenticationService.getUserByToken(token);

  req.user = user;

  return next();
};
