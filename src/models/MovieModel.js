const db = require("../services/DatabaseService");
const rabbitMQ = require("@joinf/rabbitmq");

class MovieModel {
  async get(id) {
    const response = await db.execute("Select * from movies where id=$1", [id]);

    if (response.rows.length <= 0) {
      throw {
        message: "Filme não encontrado",
        status: 400,
      };
    }

    const movie = response.rows[0];

    return movie;
  }

  async list(filter) {
    const response = await db.execute(
      "Select * from movies where upper(name) like $1 or upper(detail) like $1",
      ["%" + filter.toUpperCase() + "%"]
    );

    const movie = response.rows;

    return movie;
  }

  async listByKind(kind) {
    const response = await db.execute(
      `Select * from movies where upper(kinds) like $1`,
      ["%" + kind.toUpperCase() + "%"]
    );

    const movies = response.rows;

    return movies;
  }

  async listByTag(tag) {
    const response = await db.execute(
      `Select * from movies where upper(tags) like $1`,
      ["%" + tag.toUpperCase() + "%"]
    );

    const movies = response.rows;

    return movies;
  }

  async listMostViews(kind) {
    const response = await db.execute(
      `Select * from movies where upper(kinds) like $1 order by views limit 10`,
      ["%" + kind.toUpperCase() + "%"]
    );

    const movies = response.rows;
    return movies;
  }

  async addHistory({ userId, movieId }) {
    const message = JSON.stringify({
      userId,
      movieId,
    });

    rabbitMQ.producer.publish("netflix_topic", "historics", message);
  }
}

module.exports = new MovieModel();
