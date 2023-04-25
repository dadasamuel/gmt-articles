const { pool } = require("../database/db");
const { allow } = require("../middleware/auth");

exports.createPost = async (req, res, next) => {
    const { post_title, post_body, attachment } = req.body
    const userid = req.users.id
    try {
       const newPost = await pool.query(
            "INSERT INTO post (post_title, post_body, attachment, userid) VALUES ($1, $2, $3, $4) RETURNING *",
            [post_title, post_body, attachment, userid]
        );
        return res.status(201).json ({
            message: "Post successfully created",
            newPost,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}


exports.viewAllPost = async (req, res, next) => {
    try {
        // pagination
        const allPost = await pool.query(
            "SELECT * FROM post By id LIMIT 10 OFFSET (2 - 1) * 10"
        );
        const count = await pool.query("SELECT COUNT(*)FROM post");
        return res.status(200).json({
            message: "post fetch successfully",
            count: count.rows[0],
            allPost: allPost.rows,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
    });
    }
};