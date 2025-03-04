const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const bcryptjs = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose"); // Ensure mongoose is imported
//require("dotenv").config();

router.get('/', user_jwt, async(req, res, next) => {
    try {

        const user = await User.findById(req.user.id).select('-password');
            res.status(200).json({
                token:jwt,
                success: true,
                user: user
            });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
        next();
    }
});
/*
router.post('/register', async (req, res, next) => {
    console.log("Received request:", req.body); // Debug input data
    console.log("MongoDB connected:", mongoose.connection.readyState); // Check DB connection
    console.log("JWT Secret:", process.env.jwtUserSecret); // Check if the secret is loaded

    const { username, email, password } = req.body;

    try {
        
        let user_exist = await User.findOne({ email: email });

        if(user_exist) {
            return res.status(400).json({
                success: false,
                msg: 'User already exists'
            });
        }
        
        let user = new User();

        user.username = username;
        user.email = email;

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        let size = 200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';


        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }


        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            
            res.status(200).json({
                
                success: true,
                token: token
            });
        });



    } catch(err) {
        console.log(err);
        res.status(402).json({
            success: false,
            message: 'Something error occured'
        })
    }
}); */
router.post("/register", async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("MongoDB connection status:", mongoose.connection.readyState);

        // Check if JWT secret is loaded
        const jwtSecret = process.env.jwtUserSecret;
        if (!jwtSecret) {
            console.error("Error: JWT Secret is missing");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if user already exists
        let userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create a new user instance
        const user = new User({
            username,
            email,
            password: await bcryptjs.hash(password, 10), // Hash password
            avatar: `https://gravatar.com/avatar/?s=200&d=retro`
        });

        // Save user to database
        await user.save();

        // Create JWT token
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                console.error("JWT Sign Error:", err);
                return res.status(500).json({ success: false, message: "Token generation failed" });
            }
            res.status(201).json({ success: true, token });
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});




router.post('/login', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {

        let user = await User.findOne({
            email: email
        });

        if(!user) {
            return res.status(400).json({
                success: false,
                msg: 'User not exists go & register to continue.'
            });
        }


        const isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid password'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, process.env.jwtUserSecret,
            {
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;

                res.status(200).json({
                    success: true,
                    msg: 'User logged in',
                    token: token,
                    user: user
                });
            }
        )

    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
    }
});

module.exports = router;