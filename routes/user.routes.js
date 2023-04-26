const express = require("express");
const { createPost, viewAllPost } = require("../controllers/post.ctrl");
const { createComment } = require("../controllers/comment.ctrl");
const { allow, isAdmin, isAuthenticated } = require("../middleware/auth");
const { payment, confirmPayment } = require("../controllers/user.ctrl");
const router = express.Router();


router.post("/post", isAuthenticated, createPost);
router.get("/all-post", viewAllPost);
router.post("/comment", isAuthenticated, createComment);
router.post("/payment", payment);
router.post("/confirm-payment", confirmPayment);

const userRoute = router

module.exports = userRoute

