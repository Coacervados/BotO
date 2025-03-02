import { User } from '@prisma/client';
import { Controller, Post } from 'damex';
import { Request, Response } from 'express';
import { AuthService } from '../services';

@Controller('/auth')
export class AuthController {
    @Post('/login')
    async login(req: Request, res: Response) {
        const { email, password } = req.body as User;

        if (!email || !password) {
            res.status(400).send('Email and password are required');
            return;
        }

        const { error, jwt } = await AuthService.login({ email, password });

        if (error && !jwt) {
            res.status(error.code).send(error.message);
        }

        res.status(200).send({ jwt });
    }

    @Post('/register')
    async register(req: Request, res: Response) {
        const { email, password, name } = req.body as User;

        if (!email || !password || !name) {
            res.status(400).send('name, email, password and are required');
            return;
        }

        const { error, jwt } = await AuthService.register({
            email,
            password,
            name,
        });

        if (error && !jwt) {
            res.status(error.code).send(error.message);
        }

        res.status(200).send({ jwt });
    }
}
