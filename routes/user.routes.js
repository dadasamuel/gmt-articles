const express = require("express");
const { createPost, viewAllPost } = require("../controllers/post.ctrl");
const { createUser, userLogin } = require("../controllers/user.ctrl");
const { createComment } = require("../controllers/comment.ctrl");
const { allow, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

router.post("/sign-up", createUser);
router.post("/login", userLogin);
router.post("/post", isAuthenticated, createPost);
router.get("/all post", viewAllPost);
router.post("/comment", createComment);

const userRoute = router

module.exports = userRoute

