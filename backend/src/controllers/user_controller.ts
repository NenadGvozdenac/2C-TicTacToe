import User from '../models/user';

import { Request, Response } from 'express';

class UserController {
    static async register(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = new User({ username, password });
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

        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful', token: 'token' });
    }
}

export default UserController;