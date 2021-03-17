const MovieModel = require("../models/MovieModel");

class MovieController {
  async list(req, res) {
    const { filter } = req.query;
    const movies = await MovieModel.list(filter || "");

    res.send(movies);
  }

  async get(req, res) {
    const { movieId } = req.params;

    const movie = await MovieModel.get(movieId);

    res.send(movie);
  }

  async watched(req, res) {
    const { movieId } = req.params;

    await MovieModel.addHistory(movieId);

    res.sendStatus(201);
  }
}

module.exports = new MovieController();
