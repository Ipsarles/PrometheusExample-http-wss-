const axios = require("axios");
const express = require("express");
const app = express();
const port = 3001;
const client = require("prom-client");


const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Create a Registry to register the metrics
const register = new client.Registry();

client.collectDefaultMetrics({
  app: "node-application-monitoring-app",
  prefix: "node_",
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});

const httpRequestTimer = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

// Register the histogram
register.registerMetric(httpRequestTimer);

// Mock slow endpoint, waiting between 3 and 6 seconds to return a response
const createDelayHandler = async (req, res) => {
  // if (Math.floor(Math.random() * 100) === 0) {
  //   throw new Error("Internal Error");
  // }
  // Generate number between 3-6, then delay by a factor of 1000 (miliseconds)
  const delaySeconds = Math.floor(Math.random() * (6 - 3)) + 3;
  await new Promise((res) => setTimeout(res, delaySeconds * 10));
  res.end("Slow url accessed!");
};

// isn't monitored
app.get(" ", (req, res) => {
  console.log("A call");
  res.send("Hello World!");
});

app.get("/metrics", async (req, res) => {
  // Start the HTTP request timer, saving a reference to the returned method
  const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  const route = req.route.path;

  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
  // res.send("ok fine");

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

const InternFcn = async (req, res) => {
  await axios.get("http://localhost:3001/Intern");
  res.send("Intern called");
};

app.get("/Intern", async (req, res) => {
  // await sleep(100);
  // Start the HTTP request timer, saving a reference to the returned method
  const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  const route = req.route.path;
  console.log("intern has called");
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
  // res.send("ok fine");

  // End timer and add labels
  console.log(req.method, req.route.path, res.statusCode);
  end({ route, code: res.statusCode, method: req.method });
});

app.get("/Interncall", async (req, res) => {
  // Start the HTTP request timer, saving a reference to the returned method
  const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  const route = req.route.path;
  await InternFcn(req, res);
  // res.setHeader("Content-Type", register.contentType);
  // res.send(await register.metrics());
  // res.send("ok fine");

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method });
});

//
app.get("/slow", async (req, res) => {
  const end = httpRequestTimer.startTimer();
  const route = req.route.path;
  await createDelayHandler(req, res);
  end({ route, code: res.statusCode, method: req.method });
});

app.listen(port, () => {
  console.log(`listening on port ${port} bg`);
});
