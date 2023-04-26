const express = require("express");
const { createPost, viewAllPost, deletePost } = require("../controllers/post.ctrl");
const { createComment } = require("../controllers/comment.ctrl");
const { allow, isAdmin, isAuthenticated } = require("../middleware/auth");
const { payment, confirmPayment } = require("../controllers/user.ctrl");
const router = express.Router();


router.post("/post", isAuthenticated, createPost);
router.get("/all-post/:page/:limit", isAuthenticated, viewAllPost);
router.post("/comment", isAuthenticated, createComment);
router.post("/payment",isAuthenticated, payment);
router.post("/confirm-payment", confirmPayment);
router.delete("/delete/:id", isAuthenticated, deletePost);

const userRoute = router

module.exports = userRoute

