const UserService = require("../services/UserService");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não informado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) return res.status(401).send("Token inválido");

  const userService = new UserService(token);

  const user = await userService.getUser();

  req.token = token;

  req.user = user;

  return next();
};
