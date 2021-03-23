const Eureka = require("eureka-js-client").Eureka;
const { v4: uuidv4 } = require("uuid");

exports.register = function ({
  app,
  port,
  hostName,
  ipAddr,
  healthCheckUrl,
  eurekaHost,
  eurekaPort,
}) {
  const instanceId = uuidv4();

  const client = new Eureka({
    // application instance information
    instance: {
      app,
      hostName,
      ipAddr,
      port: {
        $: port,
        "@enabled": "true",
      },
      instanceId: instanceId,
      vipAddress: app,
      statusPageUrl: healthCheckUrl,
      healthCheckUrl,
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: "/eureka/apps",
      registerWithEureka: true,
      fetchRegistry: true,
    },
  });

  /* const client = new Eureka({
    instance: {
      app: appName,
      hostName: hostName,
      ipAddr: ipAddr,
      port: {
        $: PORT,
        "@enabled": "true",
      },
      vipAddress: appName, 
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    //retry 10 time for 3 minute 20 seconds.
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: "/eureka/apps/",
      maxRetries: 10,
      requestRetryDelay: 2000,
    },
  }); */

  client.logger.level("debug");

  client.start((error) => {
    console.log(error || "user service registered");
  });

  function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
      client.stop();
    }
  }

  client.on("deregistered", () => {
    console.log("after deregistered");
    process.exit();
  });

  client.on("started", () => {
    console.log("eureka host  " + eurekaHost);
  });

  process.on("SIGINT", exitHandler.bind(null, { exit: true }));

  return client;
};
