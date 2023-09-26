const jwt = require("jsonwebtoken");
const client = require("./connections_redis");

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
    const expirationTime = "7d";
    if (!payload) {
      return null;
    }
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: expirationTime },
        (err, token) => {
          if (err) {
            reject(err);
          }

          client.set(payload.userId.toString(), token, (err, reply) => {
            if (err) {
              reject(err);
            }
            resolve(token);
          });
          resolve(token);
        }
      );
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
  verifyRefreshToken: async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "No refreshToken provided" });
    }

    try {
      const decoded = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const payload = await client.get(decoded.userId);

      if (payload.toString() !== refreshToken) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
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
