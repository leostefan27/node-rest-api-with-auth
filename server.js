const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

require("dotenv").config({ path: "./.env" });

// Connect to the database
connectDB();

const corsOptions = {
  origin: "https://localhost:5001",
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));

// Routes
app.use("/api/users", require("./routes/UserRoutes"));
app.use("/api/articles", require("./routes/ArticleRoutes"));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
