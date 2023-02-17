const PORT = 3002;
// const client = require("prom-client");
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const axios = require("axios");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const ioMetrics = require("socket.io-prometheus");
const promRegister = require("prom-client").register;
const client = require("prom-client");


const httpRequestTimer = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

ioMetrics(io);

io.on("connection", (socket) => {
  console.log("A user has connected");
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
    // axios.get("http://localhost:3002/noice").then((res) => {
    //   console.log(res.data);
    // });
  });
});

// app.get("/noice", async (req, res) => {
//   // Start the HTTP request timer, saving a reference to the returned method
//   const end = httpRequestTimer.startTimer();
//   console.log("Noice");
//   end({ route:"wss", code: "200", method: "wss" });
// });

app.get("/metrics", async (req, res) => {
  // Start the HTTP request timer, saving a reference to the returned method
  // const end = httpRequestTimer.startTimer();
  // Save reference to the path so we can record it when ending the timer
  // const route = req.route.path;

  res.setHeader("Content-Type", promRegister.contentType);
  res.send(await promRegister.metrics());
  // res.send("ok fine");

  // End timer and add labels
  // end({ route, code: res.statusCode, method: req.method });
});

server.listen(PORT, () => {
  console.log(`Connection success on ${PORT}`);
});
