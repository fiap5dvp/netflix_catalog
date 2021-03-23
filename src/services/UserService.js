const axios = require("axios");

class UserService {
  constructor(token) {
    this.token = token;
  }
  async getUser() {
    try {
      const response = await axios({
        url: `${process.env.URL_AUTHENTICATION}/api/users`,
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
        baseUrl: process.env.URL_AUTHENTICATION,
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
        baseUrl: process.env.URL_AUTHENTICATION,
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
        baseUrl: process.env.URL_AUTHENTICATION,
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
        baseUrl: process.env.URL_AUTHENTICATION,
        error,
      };
    }
  }
}

module.exports = UserService;
