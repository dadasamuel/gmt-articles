const { pool } = require("../database/db");
const uuid = require("uuid")
const axios = require("axios")


exports.payment = async (req, res) => {
    try {
        const { id } = req.body;
        const subscription = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        console.log(subscription.rows[0]);

        const ref = uuid.v4();

        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: ref, // Generate a UUID for the transaction reference
                amount: "50", // Convert the amount to a string
                currency: "NGN",
                redirect_url:
                    "https://webhook.site/70af7eea-88a5-4c99-985b-3186e2f9281c",
                meta: {
                    consumer_id: uuid.v4(),
                    consumer_mac: "92a3-912ba-1192a",
                },
                customer: {
                    email: subscription.rows[0].email,
                    name: subscription.rows[0].firstname,
                },
                customizations: {
                    title: "Flutterwave",
                    logo: "http://www.w3.org/2000/svg",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                },
            }
        );
        console.log(response);

        res.send(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal server error" });
    }
};

exports.confirmPayment = async (req, res) => {

        const secretHash = process.env.FLW_SECRET_HASH;

        const signature = req.headers["verif-hash"];

        if (!signature || signature !== secretHash) {
            // This request isn't from Flutterwave; discard
            res.status(401).end();
        }

        const payload = req.body;
        const id = payload.id
        try {
            if (payload.status !== "successful") {
                throw new Error("Payment was not successful.");
            }

            const updatedUser = await pool.query(
                "UPDATE users SET status = 'subscribed' WHERE id = $1",
                [id]
            );

            // TODO: Convert event details to PDF format

            const response = {
                message: "Payment successful",
                transaction: updatedUser.rows[0],
            };

            return res.status(200).json(response);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }