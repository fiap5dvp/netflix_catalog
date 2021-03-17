const Eureka = require("eureka-js-client").Eureka;

const eurekaHost = "127.0.0.1";

exports.register = function (appName, port) {
  const client = new Eureka({
    // application instance information
    instance: {
      app: appName,
      // app: `${appName}-${port}`,
      hostName: "localhost",
      ipAddr: "127.0.0.1",
      port: {
        $: port,
        "@enabled": "true",
      },
      instanceId: appName,
      vipAddress: appName,
      // vipAddress: `${appName}-${port}`,
      statusPageUrl: `http://localhost:${port}`,
      healthCheckUrl: `http://localhost:${port}/status`,
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      host: "127.0.0.1",
      port: 8761,
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
