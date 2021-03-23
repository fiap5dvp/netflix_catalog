const MovieModel = require("../models/MovieModel");
const UserService = require("../services/UserService");
class MovieController {
  async list(req, res) {
    const { filter, kind } = req.query;

    const movies = await MovieModel.list(filter, kind);

    res.send(movies);
  }

  async get(req, res) {
    const { movieId } = req.params;

    const movie = await MovieModel.get(movieId);

    const userService = new UserService(req.token);

    const future = await userService.isMovieInMyList(movie.id);

    movie.future = future;

    const liked = await userService.isMovieLiked(movie.id);

    movie.liked = liked;

    const viewed = await userService.isViewed(movie.id);

    movie.viewed = viewed;

    res.send(movie);
  }

  async update(req, res) {
    const { movieId } = req.params;
    const { name, detail, kinds, tags } = req.body;

    await MovieModel.update(movieId, { name, detail, kinds, tags });

    res.sendStatus(201);
  }

  async viewed(req, res) {
    const { movieId } = req.params;

    await MovieModel.viewed({ userId: req.user.id, movieId });

    res.sendStatus(201);
  }
}

module.exports = new MovieController();
