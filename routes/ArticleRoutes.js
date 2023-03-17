const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticlesByUser,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/ArticleController");
const protect = require("../middlewares/AuthMiddleware");

router.get("/all", getAllArticles);
router.get("/user/:id", getArticlesByUser);
router.get("/article/:id", getArticle);
router.post("/add", protect, createArticle);
router.put("/edit/:id", protect, updateArticle);
router.delete("/delete/:id", protect, deleteArticle);

module.exports = router;
