const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtServices = require("../heplers/jwt_services");
const authController = {
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

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const accessToken = await jwtServices.signToken({
        userId: user._id,
        admin: user.admin,
      });
      const refreshToken = await jwtServices.signRefreshToken({
        userId: user._id,
        admin: user.admin,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      const { password: _password, ...userData } = user._doc;

      return res.status(200).json({ user: userData, accessToken });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: "Login failed" });
    }
  },
  refreshToken: async (req, res) => {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const accessToken = await jwtServices.signToken({
      userId: user._id,
      admin: user.admin,
    });
    const refreshToken = jwtServices.signRefreshToken({
      userId: user.userId,
      admin: user.admin,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    return res.status(200).json({ accessToken });
  },
};

module.exports = authController;
