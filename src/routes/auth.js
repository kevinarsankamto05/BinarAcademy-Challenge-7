const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/auth.controller"),
  { users } = require("../models");

router.get("/", (req, res) => {
  return res.render("index");
});

router.get("/create", (req, res) => {
  return res.render("create_users");
});

router.get("/reset-password", (req, res) => {
  return res.render("reset_password");
});

router.get("/set-password", (req, res) => {
  return res.render("set_password");
});

router.get("/set-password-key/:key", async (req, res) => {
  try {
    const findData = await users.findFirst({
      where: {
        resetPasswordToken: req.params.key,
      },
    });
    if (!findData) {
      return res.render("error");
    }

    return res.render("set_password", { user: findData });
  } catch (error) {
    console.log(error);
    return res.render("error");
  }
});

router.post("/api/register", controller.register);
router.post("/api/reset-password", controller.resetPassword);
router.post("/api/set-password", controller.setPassword);

module.exports = router;
