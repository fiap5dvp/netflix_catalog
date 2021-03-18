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

  async update(id, props) {
    const { name, detail, kinds, tags } = props;

    const response = await db.execute("Select * from movies where id=$1", [id]);

    if (response.rows.length <= 0) {
      throw {
        message: "Filme não encontrado",
        status: 400,
      };
    }

    await db.execute(
      `
      Update movies set 
        name = $1, 
        detail = $2, 
        kinds = $3, 
        tags= $4
      where
        id = $5
    `,
      [name, detail, kinds, tags, id]
    );

    rabbitMQ.producer.publish("netflix-movies-topic", "rk-alter-movie", {
      id,
      props,
    });
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

  async viewed({ userId, movieId }) {
    const movie = await this.get(movieId);

    await db.execute(`update movies set views = views + 1 where id = $1`, [
      movieId,
    ]);

    const message = {
      userId,
      movieId,
      movieName: movie.name,
      movieDetail: movie.detail,
    };

    rabbitMQ.producer.publish("netflix-viewed-fanout", "", message);
  }
}

module.exports = new MovieModel();
