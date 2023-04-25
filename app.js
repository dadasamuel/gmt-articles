require("dotenv").config();
require("colors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const app = express();
const passport = require("passport");
const cors = require("cors");
const GoogleStrategy = require("./config/passport-setup");
const GithubStategy = require('./config/github-setup');
const { connectToDatabase } = require("./database/db");
const userRoute = require("./routes/user.routes");
const router = require("./routes/auth.routes");

connectToDatabase();

// use TZ LAGOS to set the timezone to lagos
process.env.TZ = "Lagos/Nigeria"; // will set the timezone to lagos
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:8000",
    credentials: true
  }
));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  maxAge: 24 * 60 * 60 * 1000
}))


//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});


app.use("/auth", router);
app.use("/user", userRoute)
// app.use("/profile", profileRoutes);

app.get(
  "/google/callback", 
  passport.authenticate("google"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

app.get(
  "/github/callback",
  passport.authenticate("github"),
  (req, res) => {
    // res.send("you have reached the callback uri");
    // console.log("ll")
    res.render("profile", { user: req.user });

  }
);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port. ${port}`.yellow.underline);
});
