const express = require("express"),
  cors = require("cors"),
  app = express(),
  PORT = process.env.PORT || 3000,
  router = require("./src/routes"),
  bodyParser = require("body-parser");

require("dotenv").config();

app.use(cors());
// app.use(express.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.set("views", "./src/view");
app.set("view engine", "ejs");

app.listen(PORT, () => console.log(`App is running at PORT ${PORT}`));
