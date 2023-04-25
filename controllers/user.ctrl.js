const { pool } = require("../database/db");
const bcrypt = require ("bcrypt")
const jwt = require ("jsonwebtoken");

exports.createUser = async (req, res) => {
    try {
        const { firstname, email, password, roles, status } = req.body;
        // const email = req.body.email;
        // const password = req.body.password;
        // const roles = "user";
        // const status = "Not-Subscribed";

        const userExist = await pool.query(
            "SELECT * FROM users WHERE email = $1 ", [email]
        );
        const uniqueId = Math.floor(Math.random() * 100000)
            .toString()
            .substring(0, 10);
        const userid = "20" + uniqueId;

        if (userExist.rows[0]) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            "INSERT INTO users (userid, firstname, email, password, roles, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
            userid, firstname, email, hashedPassword, roles, status
        ]);

        return res.status(201).json({
            message: "User created successfully",
            result: newUser.rows[0],
        });
    } catch (error) {
        console.error("Error", error);
    }
}



exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
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
        const userData = { id: userFound.rows[0].id, roles: userFound.rows[0].roles, status: userFound.rows[0].status }
        const token = await jwt.sign(userData, process.env.JWT_SECRETKEY, { expiresIn: "4hr" })
        return res.status(200).json({
            message: "Logged in successfully",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};



exports.payment = async (req, res) => {
    try {
        const {email} = req.body; // Destructure the request body to get numberOfTickets, event_id, and email

        const ref = uuid.v4();

        const event = await Event.findOne({ eventSerial }); // Use findById to find the event document by its ID
        if (!event) {
            // Check if the event is null or undefined
            return res.status(404).send({ message: "Event not found" });
        }

        const totalAmount = event.price * numberOfTickets; // Calculate the total amount by multiplying the price and numberOfTickets

        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: ref, // Generate a UUID for the transaction reference
                amount: totalAmount.toString(), // Convert the amount to a string
                currency: "NGN",
                redirect_url:
                    "https://webhook.site/70af7eea-88a5-4c99-985b-3186e2f9281c",
                meta: {
                    consumer_id: uuid.v4(),
                    consumer_mac: "92a3-912ba-1192a",
                },
                customer: {
                    email,
                    phonenumber,
                    name: event.eventName
                },
                customizations: {
                    title: "Pied Piper Payments",
                    logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status === "successful") {
            // Check if the payment is successful
            const newBooking = await Booking.create({
                email,
                event: event._id, // Save the event ID to the booking document
                numberOfTickets,
                amount: event.price, // Save the event price to the booking document
                date: new Date(),
                totalAmount,
            });

            const newTransaction = await Transaction.create({
                tx_ref: ref,
                booking: newBooking._id, // Save the booking ID to the transaction document
                amount: totalAmount,
                email,
                transaction_id: response.data.transaction_id,
                status: "pending",
            });
        }

        res.send(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
    }
};