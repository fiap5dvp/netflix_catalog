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
