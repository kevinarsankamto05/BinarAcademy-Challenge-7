const express = require("express"),
  cors = require("cors"),
  http = require("http"),
  socketIO = require("socket.io"),
  app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000,
  router = require("./src/routes"),
  bodyParser = require("body-parser");

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const io = socketIO(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(router);
app.set("views", "./src/view");
app.set("view engine", "ejs");

server.listen(PORT, () => console.log(`App is running at PORT ${PORT}`));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
