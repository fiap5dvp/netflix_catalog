const Youch = require("youch");

module.exports = async (err, req, res, next) => {
  let status = null;
  let details = null;
  let message = null;
  let service = null;
  let error = null;

  if (err.error) {
    service = err.service;
    error = err.error;
    details = await new Youch(err.error, req).toJSON();

    if (err.error.code == "ECONNREFUSED") {
      message = `Serviço indisponível, tente novamente mais tarde`;
    }
  } else {
    service = process.env.SERVICE_NAME;
    error = err;
    details = await new Youch(err, req).toJSON();
  }

  if (error.response && !message) {
    status = error.response.status;
    if (error.response.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      } else {
        message = error.message;
      }
    }
  }

  if (status === 404) message = `Recurso não encontrado`;

  return res.status(status || error.status || 500).json({
    message: message || error.message || "Erro interno",
    service,
    error,
    details,
  });
};
