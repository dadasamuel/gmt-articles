const express = require("express");
const passport = require("passport");
const { ensureAuth, ensureGuest } = require("../middleware/ensureauth");
const router = express.Router();


// Auth login
// Auth login
router.get("/login",  ensureGuest, (req, res) => {
  res.render("login", { user: req.user });
});


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile"],
  })
);

router.get(
  "/google/callback",
  ensureAuth,
  passport.authenticate("google"),
  (req, res) => {
    // res.send("you have reached the callback uri");
    // console.log("ll")
     res.render("profile", { user: req.user });

  }
);
router.get(
  "/github/callback",
  ensureAuth,
  passport.authenticate("github"),
  (req, res) => {
    // res.send("you have reached the callback uri");
    // console.log("ll")
     res.render("profile", { user: req.user });

  }
);




module.exports = router;