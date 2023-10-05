const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const client = require("./heplers/connections_redis");

const authRoute = require("./routers/auth.router");
const userRoute = require("./routers/user.router");

const app = express();
const port = process.env.PORT || 8000;
mongoose.set("strictQuery", false);

dotenv.config();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
client.on("connect", function () {
  console.log("connected to Redis");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routers

app.use("/api-v1/auth", authRoute);
app.use("/api-v1/user", userRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODB_URI);
});
