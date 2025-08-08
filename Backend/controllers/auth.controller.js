import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//  REGISTER FUNCTION
export async function register(req, res) {
    try {
        const { username, password , email} = req.body;
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail=await User.findOne({ email});
        if(existingEmail){
            return res.status(400).json({message: 'Email already exist'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }    

    res.status(201).json({ message: 'User registered successfully' });
    
}

//  LOGIN FUNCTION
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Comparing password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }


        // Creating JWT token 
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successfull',
            token: token,
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}