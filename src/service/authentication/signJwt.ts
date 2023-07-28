import jwt from 'jsonwebtoken';
import { User } from '../../model';
function signJwt(user:User,roles: string[])
{   
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT secret is not defined. Please set the JWT_SECRET environment variable.');
    }
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            roles
        }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });
}

export { signJwt }