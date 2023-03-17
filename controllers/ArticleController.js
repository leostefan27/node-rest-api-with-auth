const asyncHandler = require("express-async-handler");
const Article = require("../models/Article");

// @desc Get all articles
// @route GET request to /articles/all
// @privacy Public
const getAllArticles = asyncHandler(async (req, res) => {
  // Get the articles from the db
  const data = await Article.find({}).lean().sort({ date: "desc" });
  // Check if there are no articles found
  if (!data) {
    res.status(400).json({ message: "There are no articles yet!" });
  }

  res.status(200).json(data);
});

// @desc Get all articles of a single user
// @route GET request to /articles/user/:id
// @privacy Public
const getArticlesByUser = asyncHandler(async (req, res) => {
  // Get the articles from the db
  const data = await Article.find({ author: req.params.id })
    .lean()
    .sort({ date: "desc" });
  // Check if there are no articles found
  if (!data) {
    res.status(400).json({ message: "There are no articles yet!" });
  }

  res.status(200).json(data);
});

// @desc Get single article
// @route GET request to /articles/article/:id
// @privacy Public
const getArticle = asyncHandler(async (req, res) => {
  const data = await Article.findById(req.params.id).lean();

  if (!data) {
    res.status(400).json({ message: "Article not found!" });
  }

  res.status(200).json(data);
});

// @desc Create a new article
// @route POST request to /articles/add
// @privacy Private
const createArticle = asyncHandler(async (req, res) => {
  // Get the article fields value from FRONTEND
  const article = {
    author: req.user._id,
    title: req.body.title,
    body: req.body.body,
  };

  // Check if all the fields are completed
  if (!author || !title || !body) {
    res.status(400).json({ message: "Missing Field" });
    return;
  }

  // Add article to db
  try {
    await Article.create(article);
    res.status(201).json(article);
  } catch (error) {
    console.error(error);
  }
});

// @desc Update an existing article
// @route PUT request to /articles/edit/:id
// @privacy Private
const updateArticle = asyncHandler(async (req, res) => {
  // Check if the article exists
  const article = await Article.findById(req.params.id).lean();

  if (!article) {
    res.status(400).json({ message: "Article not found!" });
    return;
  }

  // Update the article
  try {
    if (req.user._id === article.author) {
      await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });

      res.status(201).json({ message: "Article updated succesfully" });
    } else {
      res.status(400).json({ message: "User not allowed" });
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

// @desc Delete an article
// @route DELETE request to /articles/delete/:id
// @privacy Private
const deleteArticle = asyncHandler(async (req, res) => {
  // Check if the article exists
  const article = await Article.findById(req.params.id).lean();

  if (!article) {
    res.status(400).json({ message: "Article not found" });
    return;
  }

  // Delete the article
  try {
    if (req.user._id === article.author) {
      await article.remove();
      res.status(200).json({ message: "Article deleted" });
    } else {
      res.status(400).json({ message: "User not allowed" });
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  getAllArticles,
  getArticlesByUser,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
