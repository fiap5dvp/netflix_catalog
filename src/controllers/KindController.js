const MovieModel = require("../models/MovieModel");

class KindController {
  async list(req, res) {
    const { kind } = req.params;
    const movies = await MovieModel.listByKind(kind);
    res.send(movies);
  }

  async mostViews(req, res) {
    const { kind } = req.params;

    const movies = await MovieModel.listMostViews(kind);

    res.send(movies);
  }
}

module.exports = new KindController();
