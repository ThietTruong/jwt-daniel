const jwt = require("jsonwebtoken");

const jwtServices = {
  signToken: async (payload) => {
    if (!payload) return;
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },
  signRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  },
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  },
  verifyRefreshToken: (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "No refreshToken provided" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
      }
    );
  },
  verifyTokenWithAdmin: (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (decoded.admin == true || decoded.userId == req.params.id) {
        req.user = decoded;
        return next();
      }
      return res.status(401).json({ message: "Not allow to access" });
    });
  },
};
// Storage Token
// 1) Local storage
// XSS
// 2) HTTP only cookie
// CSRF -> SAMESITE cookie
// 3) Redux store => ACCESS_TOKEN
// HTTP ONLY => REFRESH_TOKEN
// BFF Pattern
module.exports = jwtServices;
