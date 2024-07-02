import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const jwt_secret = "secret"

const generateJwtToken = (payload: any) => {
    return jwt.sign(payload, jwt_secret, { expiresIn: '1h' });
}

const verifyJwtToken = (token: string) => {
    return jwt.verify(token, jwt_secret);
}

const verifyJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = verifyJwtToken(token);
        req.body.decoded_token = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export { generateJwtToken, verifyJwtToken, verifyJwtMiddleware };