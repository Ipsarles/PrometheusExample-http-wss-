import { io } from "socket.io-client";

const socket = io({
  reconnectionDelayMax: 10000,
  auth: { token: "123" },
  query: { "my-key": "my-value" },
});
