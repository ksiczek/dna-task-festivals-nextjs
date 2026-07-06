import { Request } from 'express';
import { db } from './db';

export interface AuthContext {
    userId: string | null;
}

export const buildAuthContext = ({ req }: { req: Request }): AuthContext => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return { userId: null };
    }

    // Token is the user id – verify it exists in the DB
    const user = db.getAllUsers().find(({ id }) => id === token);

    return { userId: user ? user.id : null };
};
