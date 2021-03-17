const { Pool } = require("pg");

class DataBaseService {
  constructor() {
    /* this.pool = new Pool({
      connectionString:
        "postgres://fyazuind:r34WG7VcdfJvN4WplbWYHEk-hfyYELv1@isilo.db.elephantsql.com:5432/fyazuind",
    }); */

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // max: 20,
      // idleTimeoutMillis: 30000,
      // connectionTimeoutMillis: 2000,
    });
  }

  async execute(text, params) {
    try {
      const response = await this.pool.query(text, params);
      // this.pool.end();
      return response;
    } catch (error) {
      switch (error.code) {
        case "ECONNREFUSED":
          throw new Error(
            "Não foi possível conectar ao banco de dados. Verifique se o banco de dados está ativo."
          );

        default:
          throw error;
      }
    }
  }
}

module.exports = new DataBaseService();
