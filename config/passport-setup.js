const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { pool } = require("../database/db");
const jwt = require("jsonwebtoken")

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (rows.length > 0) {
    done(null, rows[0]);
    console.log(rows[0]);
  } else {
    done(new Error(`User with id ${id} not found`));
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "/google/callback",
      callbackURL: process.env.NODE_ENV === "production" ? "https://gmt-articles.herokuapp.com/" : "http://localhost:8000/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      console.log(
        { userid: profile.id },
        { firstName: profile.displayName },
        { email: profile.emails[0].value }
      );

      const  row  = await pool.query(
        "SELECT * FROM users WHERE userid = $1",
        [profile.id]
      );
      const currentUser = row.rows[0];
      console.log(currentUser)

     

      if (currentUser) {
        const token = jwt.sign(currentUser, process.env.JWT_SECRETKEY, { expiresIn: "4hr" })
        console.log(`user is: ${currentUser.firstName}`);
        
        console.log("Current user is ".red, currentUser);
        console.log(token);
        done(null, currentUser, token);
      } else {
        const newUser = {
          userid: profile.id,
          firstName: profile.displayName,
          email: profile.emails[0].value,
        };
        const token = jwt.sign(newUser, process.env.JWT_SECRETKEY, {expiresIn: '4hr'},)
        console.log(token);
        const { rows: insertedRows } = await pool.query(
          "INSERT INTO users(userid, firstName, email) VALUES($1, $2, $3) RETURNING *",
          [newUser.userid, newUser.firstName, newUser.email]
        );
        console.log(`new user created ${insertedRows[0]}`.yellow);
        done(null, insertedRows[0]);
      }
    }
  )
);
