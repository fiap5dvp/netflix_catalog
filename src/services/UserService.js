const axios = require("axios");

class UserService {
  constructor(token) {
    this.token = token;
  }
  async getUser() {
    try {
      const response = await axios({
        url: `${process.env.USER_SERVICE_URL}/api/users`,
        method: "GET",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
        timeout: 5000,
      });

      return response.data;
    } catch (error) {
      throw {
        service: "User",
        baseUrl: process.env.USER_SERVICE_URL,
        error,
      };
    }
  }

  async isMovieInMyList(movieId) {
    try {
      const response = await axios({
        url: `${process.env.USER_SERVICE_URL}/api/futures`,
        method: "GET",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
        timeout: 5000,
      });

      let status = false;
      const movies = response.data.find((m) => m.id === movieId);
      if (movies) status = true;

      return status;
    } catch (error) {
      throw {
        service: "User",
        baseUrl: process.env.USER_SERVICE_URL,
        error,
      };
    }
  }

  async isMovieLiked(movieId) {
    try {
      const response = await axios({
        url: `${process.env.USER_SERVICE_URL}/api/likes`,
        method: "GET",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
        timeout: 5000,
      });

      let status = false;
      const movies = response.data.find((m) => m.id === movieId);
      if (movies) status = true;

      return status;
    } catch (error) {
      throw {
        service: "User",
        baseUrl: process.env.USER_SERVICE_URL,
        error,
      };
    }
  }

  async isViewed(movieId) {
    try {
      const response = await axios({
        url: `${process.env.USER_SERVICE_URL}/api/historics`,
        method: "GET",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
        timeout: 5000,
      });

      let status = false;
      const movies = response.data.find((m) => m.id === movieId);
      if (movies) status = true;

      return status;
    } catch (error) {
      throw {
        service: "User",
        baseUrl: process.env.USER_SERVICE_URL,
        error,
      };
    }
  }
}

module.exports = UserService;
