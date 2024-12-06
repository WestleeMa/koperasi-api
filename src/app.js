const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("ada request");
  res.json({ msg: "Selamat datang di API Koperasi" });
});

app.use(express.urlencoded({ extended: true }));
const Router = require("./routes/route");

app.use("/", Router);

app.listen(6000);
