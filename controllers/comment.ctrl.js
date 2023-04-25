const { pool } = require("../database/db");


exports.createComment = async (req, res, next) => {
    try {
        const findPost = await pool.query(
            "SELECT * FROM post WHERE postid = $1", [postid]
        )
        if (!findPost)
        return res.status(409).json({
            message: "Post not found"
        })
        else (
            "INSERT INTO comment (post_comment, userid, postid ) VALUES ($1, $2, $3) RETURNING *",
            [post_comment, userid, postid]
        );

        return res.status(201).json({
            message: "comment sent",
            post_comment,
        });
    } catch (error) {
        return res.status(500).json({
            message: `${error.message}, Please try again later.`,
        });
    }
};