import User from '../models/user';

import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { generateJwtToken, verifyJwtToken } from '../middleware/jwt_middleware';

import JwtPayload from '../types/JwtPayload';

class UserController {
    static async register(req: Request, res: Response) {
        const { username, password, confirmPassword } = req.body;

        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt: string = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const user = new User({ username, password: hashedPassword });
        
        try {
            await user.save();
            return res.status(201).json({ message: 'User created' });
        } catch (error) {
            return res.status(400).json({ message: 'Username already exists' });
        }
    }

    static async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Hash password to compare with hashed password in database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful', token: generateJwtToken({ username })});
    }

    static async getAllUsers(req: Request, res: Response) {
        const users = await User.find();
        return res.status(200).json(users);
    }

    static async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await User.findByIdAndDelete(id);
            return res.status(200).json({ message: 'User deleted' });
        } catch (error) {
            return res.status(404).json({ message: 'User not found' });
        }
    }

    static async verify(req: Request, res: Response) {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        try {
            const decoded: JwtPayload = verifyJwtToken(token); // Assuming verifyJwtToken returns JwtPayload
            const { username } = decoded; // Access 'username' from decoded payload
            return res.status(200).json({ message: 'Token is valid', username });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default UserController;