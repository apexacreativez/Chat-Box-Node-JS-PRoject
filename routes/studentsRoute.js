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
const { body, validationResult } = require("express-validator");
const logger = require('../middleware/logger');

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
router.post(
  "/ask",
  [
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ min: 2 })
      .withMessage("Message must be at least 2 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation failed: ${errors.array()[0].msg}`);
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { message } = req.body;
    logger.info(`Received message: ${message}`);

    try {
      const { reply, statuscode } = await Apifunction(message);
      logger.info(`API call success. Reply sent.`);
      res.status(statuscode).json({ reply, statuscode });
    } catch (error) {
      logger.error(`API call failed: ${error.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


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
