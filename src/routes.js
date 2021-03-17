const { Router } = require("express");

const rabbitMQ = require("./RabbitMQ");

const routes = Router();

const AuthMiddleware = require("./middlewares/AuthMiddleware");

const MovieController = require("./controllers/MovieController");
const KindController = require("./controllers/KindController");
const TagController = require("./controllers/TagController");

routes.use("/api", AuthMiddleware);

routes.get("/api/movies", MovieController.list);
routes.get("/api/movies/:movieId", MovieController.get);
routes.get("/api/watched/:movieId", MovieController.watched);

routes.get("/api/kinds/:kind", KindController.list);
routes.get("/api/mostviews/:kind", KindController.mostViews);

routes.get("/api/tags/:tag", TagController.list);

module.exports = routes;
