const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pool = require('./db');

const app = express();

// Initialize the session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );

        if (!userFound.rows[0]) {
            return res.status(409).json({
                message: "User not found"
            });
        }

        const hashedPassword = userFound.rows[0].password;

        if (!password) {
            return res.status(401).json({
                message: "Password is required"
            });
        }

        const validPassword = await bcrypt.compare(password, hashedPassword);

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // Store the user's session object
        req.session.user = { id: userFound.rows[0].id, email: userFound.rows[0].email };

        return res.status(200).json({
            message: "Logged in successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

// Protected endpoint
app.get('/profile', (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        // Retrieve the user's session object
        const user = req.session.user;
        return res.status(200).json({ id: user.id, email: user.email });
    } else {
        return res.status(401).send('Unauthorized');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
