const MovieModel = require("../models/MovieModel");

class TagController {
  async list(req, res) {
    const { tag } = req.params;
    const movies = await MovieModel.listByTag(tag);
    res.send(movies);
  }
}

module.exports = new TagController();
