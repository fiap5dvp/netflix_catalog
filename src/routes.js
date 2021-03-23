const { Router } = require("express");

const routes = Router();

const AuthMiddleware = require("./middlewares/AuthMiddleware");

const MovieController = require("./controllers/MovieController");
const KindController = require("./controllers/KindController");
const TagController = require("./controllers/TagController");

routes.use("/api", AuthMiddleware);

routes.get("/api/movies", MovieController.list);
routes.get("/api/movies/:movieId", MovieController.get);
routes.put("/api/movies/:movieId", MovieController.update);
routes.post("/api/movies/:movieId/viewed", MovieController.viewed);

routes.get("/api/tags/:tag", KindController.list);
routes.get("/api/mostviews/:kind", KindController.mostViews);

routes.get("/api/tags/:tag", TagController.list);

module.exports = routes;
