import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import JwtPayload from '../types/JwtPayload';


const jwt_secret = "secret";

const generateJwtToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, jwt_secret, { expiresIn: '1h' });
}

const verifyJwtToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, jwt_secret) as JwtPayload;
        return decoded;
    } catch (error) {
        throw error;
    }
}

export { generateJwtToken, verifyJwtToken };
