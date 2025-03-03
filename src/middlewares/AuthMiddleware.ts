import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserRequestData } from '../types/UserRequestData';

export async function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers.authorization;

    if (process.env.ENVIRONMENT === 'development') {
        res.locals.user = {
            id: 999,
            name: 'Test Man',
            email: 'teste@example.com',
        };
        next();
        return;
    }

    if (!token) {
        res.status(401).send('Unauthorized: missing authentication token');
        return;
    }

    try {
        const user = verify(token, process.env.JWT_SECRET!) as UserRequestData;

        res.locals.user = user;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
}
