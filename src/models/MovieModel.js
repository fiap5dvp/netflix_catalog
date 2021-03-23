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

  async list(filter = "", kind = "") {
    const response = await db.execute(
      "Select * from movies where upper(name) like $1 or upper(detail) like $1 and upper(kinds) like $2",
      ["%" + filter.toUpperCase() + "%", "%" + kind.toUpperCase() + "%"]
    );

    const tags = {};

    response.rows.map((movie) => {
      console.log(movie);
      const listTags = movie.tags.split(",");
      listTags.map((tag) => {
        const tagName = tag.trim();

        if (!tags[tagName]) tags[tagName] = [];

        tags[tagName].push(movie);
      });
    });

    return tags;
  }

  async listByTag(tag, kind = "") {
    const response = await db.execute(
      `Select * from movies where upper(kinds) like $1 and upper(tags) like $2`,
      ["%" + kind.toUpperCase() + "%", "%" + tag.toUpperCase() + "%"]
    );

    const movies = response.rows;

    return movies;
  }

  async listMostViews(kind) {
    const response = await db.execute(
      `Select * from movies where upper(kinds) like $1 and views > 0 order by views limit 10 `,
      ["%" + kind.toUpperCase() + "%"]
    );

    const tags = {};

    response.rows.map((movie) => {
      console.log(movie);
      const listTags = movie.tags.split(",");
      listTags.map((tag) => {
        const tagName = tag.trim();

        if (!tags[tagName]) tags[tagName] = [];

        tags[tagName].push(movie);
      });
    });

    return tags;
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
      moviePoster: movie.poster,
    };

    rabbitMQ.producer.publish("netflix-viewed-fanout", "", message);
  }
}

module.exports = new MovieModel();
