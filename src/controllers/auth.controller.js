const { users } = require("../models"),
  utils = require("../utils/utils"),
  nodemailer = require("nodemailer");

module.exports = {
  register: async (req, res) => {
    try {
      const data = await users.create({
        data: {
          email: req.body.email,
          password: await utils.cryptPassword(req.body.password),
        },
      });

      req.io.emit("newUser", data);

      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.render("error");
      }

      const encrypt = await utils.cryptPassword(req.body.email);

      await users.update({
        data: {
          resetPasswordToken: encrypt,
        },
        where: {
          id: findUser.id,
        },
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "system@gmail.com",
        to: req.body.email,
        subject: "Reset Password",
        html: `<p>Reset Password <a href="localhost:3000/set-password/${encrypt}">Click Here</a></p>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
          return res.render("error");
        }
        req.io.emit("passwordReset", { email: req.body.email });

        return res.render("success");
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  setPassword: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          resetPasswordToken: req.body.key,
        },
      });

      if (!findUser) {
        return res.status(404).json({ error: "User not found" });
      }

      await users.update({
        data: {
          password: await utils.cryptPassword(req.body.password),
          resetPasswordToken: null,
        },
        where: {
          id: findUser.id,
        },
      });

      return res.render("success");
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
};
