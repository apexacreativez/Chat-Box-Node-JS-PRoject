const express = require("express");
const {
  getStudents,
  StudentByID,
  CreateStudent,
} = require("../Controller/studentController");
const {
  getuser,
  UserByID,
  CreateUser,
} = require("../Controller/UserController");
const authenticateToken = require("../middleware/auth");
const { LoginUser } = require("../Controller/LoginController");
const Apifunction = require("../Controller/OpenaiController");
const OpenAIChatAPi = require("../Controller/OpenaiController");

const axios = require("axios");

// router object
const router = express.Router();

// Get All Students List
router.get("/getall", getStudents);

// Get Student By ID
router.get("/get/:id", StudentByID);

// Create Student
router.post("/create", CreateStudent);

// GET User all
router.get("/getuser", authenticateToken, getuser);

// Get User By ID
router.get("/getuser/:id", authenticateToken, UserByID);

// Create User
router.post("/createuser", CreateUser);
//Login API
router.post("/login", LoginUser);

// OPENAI Chat (/ask)
router.post("/ask", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
}
  try {
    const { reply, statuscode } = await Apifunction(message);
    res.status(statuscode).json({ reply, statuscode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/openai", async (req, res) => {
  const { message } = req.body;

 if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
}

  try {
    const { reply, statuscode } = await OpenAIChatAPi(message);
    res.status(statuscode).json({ reply, statuscode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
