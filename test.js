exports.payment = async (req, res, next) => {
    const { email, phonenumber, name } = req.body;
    try {
        const data = await axios({
            method: "post",
            url: "https://api.flutterwave.com/v3/payments",
            headers: {
                Authorization: `Bearer ${process.env.FLUT_SEC_KEY}`,
            },
            data: {
                tx_ref: "hooli-tx-1920bbtytty",
                amount: "100",
                currency: "NGN",
                redirect_url: "https://localhost:6111/",
                customer: {
                    email,
                    phonenumber,
                    name,
                },
            },
        });
        console.log("data:", data.data);
        console.log(data.data.status);
        if (!data.data.status || data.data.status !== "success") {
            return res.status(404).json({
                messasge: "payment Unsuccessful",
            });
        }
        await db.execute(
            "UPDATE users SET userstatus = true WHERE userstatus = false"
        );
        return res.status(200).json({
            data: data.data,
        });
    } catch (error) {
        console.log(error);
    }
};
