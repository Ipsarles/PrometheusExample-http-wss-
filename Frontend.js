const axios = require("axios");

// const url = "http://localhost:3001/interncall";
// const url = "http://localhost:3001/metrics";
// const url = "http://localhost:3001/slow";
const Urls = [
  "http://localhost:3001/interncall",
  "http://localhost:3001/metrics",
  "http://localhost:3001/slow",
];
const verifs = {
  interncall:0,
  metrics:0,
  slow:0
};
console.table(verifs);
const fcn = async () => {
  while (true) {
    const Url = Urls[Math.floor(Math.random() * Urls.length)];
    // console.log(Url);
    await axios.get(Url);
    const route = Url.split("/")[3];
    verifs[route]++;
    await sleep(Math.random() * 1000 * 1);
    console.table(verifs);
    // console.log(res.data);
    
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

fcn();
