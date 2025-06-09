const db = require("../Config/db");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

// GET ALL User Data

const getuser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmailFromToken = req.user.email;
    const requestedEmail = req.body.email;

    if (!requestedEmail || requestedEmail !== userEmailFromToken) {
      return res.status(403).send({
        success: false,
        message:
          "Unauthorized: The requested email does not match the authenticated user's email.",
      });
    }
    const query = "SELECT * FROM user_table WHERE id = ? AND email = ?";
    const [rows] = await db.query(query, [userId, userEmailFromToken]);

    if (!rows || rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User record not found or does not match token credentials.",
      });
    }
   const getAllUsersQuery = "SELECT * FROM user_table";
    const [allUsers] = await db.query(getAllUsersQuery);
    const userData = rows[0];
    res.status(200).send({
      success: true,
      message: "User data retrieved successfully",
      user: allUsers,
    });
  } catch (error) {
    console.error("Error in Get User API:", error);
    res.status(500).send({
      success: false,
      message: "Error in Get User API",
      error: error.message,
    });
  }
};

// Get User By id
// const UserByID = async(req,res) =>{
//     try {
//         const UserID = req.params.id;
//           const userEmailFromToken = req.user.email;
//         const requestedEmail = req.body.email;

//           if (!requestedEmail || requestedEmail !== userEmailFromToken) {
//             return res.status(403).send({
//                 success: false,
//                 message: 'Unauthorized: The requested email does not match the authenticated user\'s email.',
//             });
//         }

//          const query = 'SELECT * FROM user_table WHERE id = ? AND email = ?';
//         const [rows] = await db.query(query, [UserID, userEmailFromToken]);

//         if (!rows || rows.length === 0) {

//             return res.status(404).send({
//                 success: false,
//                 message: 'User record not found or does not match token credentials.'
//             });
//         }
//         // MYSQL in Find Method

//         if(!UserID){
//             return res.status(404).send({
//                 success : false,
//                 message : 'Invalid or Provide User ID'
//             })
//         }
//         const data = await db.query(' SELECT * FROM user_table WHERE id=?',[UserID])
//         if(!data){
//             return res.status(404).send({
//                 success : false,
//                 message : 'No Records Found'
//             })
//         }
//         res.status(200).send({
//             success : true,
//             message : 'Get Data BY User ID',
//             totalstudents : data[0].length,
//             UserDetails : data[0],
//              status : 200,

//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success : false ,
//             message : 'Error in User BY ID API ',
//             error
//         })

//     }
// }

const UserByID = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.user.id;
    const userEmailFromToken = req.user.email;
    const requestedEmail = req.body.email;

    if (!requestedEmail || requestedEmail !== userEmailFromToken) {
      return res.status(405).send({
        success: false,
        message:
          "Unauthorized: The requested email does not match the authenticated user's email.",
      });
    }

    if (!requestedUserId) {
      return res.status(400).send({
        success: false,
        message: "User ID is required in the URL parameter.",
      });
    }

    if (String(requestedUserId) !== String(authenticatedUserId)) {
      return res.status(403).send({
        success: false,
        message:
          "Forbidden: You can only access your own user data. The requested ID does not match your authenticated ID.",
      });
    }

    const query = "SELECT * FROM user_table WHERE id = ? AND email = ?";
    const [rows] = await db.query(query, [
      authenticatedUserId,
      userEmailFromToken,
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User record not found or does not match token credentials.",
      });
    }

    const userData = rows[0];

    res.status(200).send({
      success: true,
      message: "User data retrieved successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Error in User By ID API:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving user by ID.",
      error: error.message,
    });
  }
};

// Create User API

const CreateUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).send({
        success: false,
        message: "Email and password must be strings",
      });
    }

    email = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !emailPattern.test(email)) {
      return res.status(400).send({
        success: false,
        message: "Invalid email format or missing fields",
      });
    }

    // Check existing user
    const [existingUser] = await db.query(
      "SELECT * FROM user_table WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).send({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store in DB
    await db.query("INSERT INTO user_table (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).send({
      success: true,
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Create User API",
      error: error.message,
    });
  }
};

module.exports = { getuser, UserByID, CreateUser };
