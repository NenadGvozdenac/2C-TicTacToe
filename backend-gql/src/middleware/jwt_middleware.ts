import jwt from 'jsonwebtoken';
import JwtPayload from '../types/JwtPayload';

import { secrets } from '../database/secrets';

const generateJwtToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, secrets.JWT_SECRET, { expiresIn: '1h' });
}

const verifyJwtToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, secrets.JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw error;
    }
}

export { generateJwtToken, verifyJwtToken };
