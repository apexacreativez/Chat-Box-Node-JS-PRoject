const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config(); 

const mySqlPool = require("./Config/db");
const cors = require('cors');

const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/v1/student', require("./routes/studentsRoute.js"));

// Port
const PORT = process.env.DB_PORT || 8085;
app.get("/", (req, res) => {
  res.send("Backend is live!");
});

// DB Connection & Server Start
mySqlPool.query("SELECT 1").then(() => {
  console.log("MySQL is connected".bgCyan.white);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgMagenta.white);
  });
}).catch((error) => {
  console.error("DB Connection Failed:", error);
});
