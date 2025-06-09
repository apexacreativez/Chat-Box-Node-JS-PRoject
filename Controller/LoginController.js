const db = require("../Config/db")
const { generateToken } = require("../utils/jwt")
const bcrypt = require("bcryptjs");




// Create User API 

const LoginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).send({
                success: false,
                message: "Email and password are required"
            });
        }

        email = email.trim().toLowerCase(); // Normalize input

        const [userData] = await db.query(
            'SELECT * FROM user_table WHERE email = ?',
            [email]
        );

        if (userData.length === 0) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        const user = userData[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email
            },
            status: 200
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Login error",
            error: error.message
        });
    }
};



module.exports = {LoginUser}