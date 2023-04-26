const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;
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
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            console.log(
                { userid: profile.id },
                { firstName: profile.username },
                { email: profile.profileUrl }
            );

            const row = await pool.query(
                "SELECT * FROM users WHERE userid = $1",
                [profile.id]
            );
            const currentUser = row.rows[0];

            if (currentUser) {
                const token = jwt.sign(currentUser, process.env.JWT_SECRETKEY, { expiresIn: "4hr" })
                console.log(`user is: ${currentUser.firstName}`);

                console.log("Current user is ".red, currentUser);
                console.log(token);
                done(null, currentUser, token);
            } else {
                const newUser = {
                    userid: profile.id,
                    firstName: profile.username,
                    email: profile.profileUrl,
                };
                const token = jwt.sign(newUser, process.env.JWT_SECRETKEY, { expiresIn: '4hr' },)
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
