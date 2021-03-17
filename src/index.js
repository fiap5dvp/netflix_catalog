require("dotenv").config();

const server = require("./server");
// const eureka = require("./Eureka");

const port = process.env.PORT;

server.listen(port, () => {
  /* const client = eureka.register(`catalog`, port);

  setTimeout(() => {
    const service = client.getInstancesByAppId("catalog");

    console.log(service);
  }, 5000); */

  console.log("Service is running. Port " + port);
});
