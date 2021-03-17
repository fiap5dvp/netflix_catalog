const axios = require("axios");

class AuthenticationService {
  async getUserByToken(token) {
    try {
      const response = await axios({
        url: `${process.env.URL_AUTHENTICATION}/api/user`,
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
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
}

module.exports = new AuthenticationService();
