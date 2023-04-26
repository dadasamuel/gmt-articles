const { pool } = require("../database/db");
const { allow } = require("../middleware/auth");

exports.createPost = async (req, res) => {
    const { post_title, post_body, attachment } = req.body
    const id = req.user.id
    try {
        console.log(id);
        const newPost = await pool.query(
            "INSERT INTO post (post_title, post_body, attachment, userid) VALUES ($1, $2, $3, $4) RETURNING *",
            [post_title, post_body, attachment, id]
        );
        return res.status(201).json({
            message: "Post successfully created",
            post: newPost.rows[0],
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}


exports.viewAllPost = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const offset = (page -1) * limit;

        let sql = 'SELECT * FROM post';
        if (req.params.page || req.params.limit) {
            sql += ` LIMIT ${limit} OFFSET ${offset}`;
        }
        const data = await pool.query(sql);

        return res.status(200).json({
            message: 'All post retrieved successfully',
            data: data.rows,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const sql = "DELETE FROM post WHERE id = $1";
        const data = await pool.query(sql, [postId]);
        if (data.rowCount === 0) {
            return res.status(404).json({
                message: "Post not found",
            });
        }
        res.status(200).json({
            message: "Post deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};



