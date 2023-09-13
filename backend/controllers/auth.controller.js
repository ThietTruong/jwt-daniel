const bcrypt = require("bcrypt");
const User = require("../models/user");
const authController = {
  /**
   * Registers a new user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The user object.
   */
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      return res.status(200).json(savedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Registration failed" });
    }
  },

loginUser: async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const passwordCorrect = await bcrypt.compare(password, user.password);
    
    if (!passwordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
}
};

module.exports = authController;
