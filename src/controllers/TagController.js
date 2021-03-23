const MovieModel = require("../models/MovieModel");

class TagController {
  async list(req, res) {
    const { tag } = req.params;
    const { kind } = req.query;
    const movies = await MovieModel.listByTag(tag, kind);
    res.send(movies);
  }
}

module.exports = new TagController();
