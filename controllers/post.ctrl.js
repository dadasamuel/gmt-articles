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
        let page = req.query.page
        const limit = 10;
        page = Number(page)
        offset = (page - 1) * limit

        if (!page) {
            const result=  await pool.query("SELECT * FROM post")
            return result.rows
        }

        const result = await pool.query("SELECT * FROM post LIMIT $1 offset $2",[limit, offset])
        if (result.rows <= 0) return res.status(400).json({message: "The page yu're looking for doe not exist"})
        return result.rows
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};