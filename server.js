const express = require("express");
const Colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mySqlPool = require("./Config/db");
const app = express();
const cors = require('cors');
const SECRET_KEY = process.env.JWT_SECRET;
// const cors = require('cors');

// configure env file

app.use(cors({
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
dotenv.config();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
// app.use(cors());

// routes
app.use('/api/v1/student', require("./routes/studentsRoute.js"));


// app.get("/demo", (req, res) => {
//   res.status(200).send("<h1>Ansatt Project Node</h1>");
// });

const PORT = process.env.PORT || 8085;

mySqlPool.query("SELECT 1").then(() => {
  // MYsql connect
  console.log("Mysql is connected ".bgCyan.white);
  // listen
  app.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`.bgMagenta.white);
    })
    
}).catch((error)=>{
    console.log(error);
})
