const bcrypt = require("bcrypt");

module.exports = {
  cryptPassword: async (password) => {
    const salt = await bcrypt.genSalt(5);
    return bcrypt.hash(password, salt);
  },
};
