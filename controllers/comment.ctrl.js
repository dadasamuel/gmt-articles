const { pool } = require("../database/db");


exports.createComment = async (req, res, next) => {
    const { post_comment, id} = req.body
   
    try {
        const findPost = await pool.query(
            "SELECT * FROM post WHERE id = $1", [id]
        )
        if (!findPost)
        return res.status(409).json({
            message: "Post not found"
        })
        const comment = await pool.query(
            "INSERT INTO comment (post_comment, userid ) VALUES ($1, $2) RETURNING *",
            [post_comment, id]
        );
        const updatePost = await pool.query(
            "UPDATE post SET commentid = $1", [comment.id]
        );

        return res.status(201).json({
            message: "comment sent",
           return: comment.rows[0], 
           return: updatePost.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: `${error.message}, Please try again later.`,
        });
    }
};