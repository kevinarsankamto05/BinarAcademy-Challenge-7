const express = require("express"),
  router = express.Router(),
  authRoute = require("./auth");

router.use(authRoute);

module.exports = router;
