require("dotenv").config();

const server = require("./server");
const eureka = require("./Eureka");

const port = process.env.PORT;

server.listen(port, () => {
  eureka.register({
    app: process.env.SERVICE_NAME,
    hostName: process.env.HOST_NAME,
    port: process.env.PORT,
    healthCheckUrl: process.env.HELTH_CHECK_URL,
    eurekaHost: process.env.EUREKA_HOST,
    eurekaPort: process.env.EUREKA_PORT,
  });

  console.log("Service is running. Port " + port);
});
