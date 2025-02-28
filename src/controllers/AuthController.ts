import { User } from '@prisma/client';
import { Controller, Post } from 'damex';
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

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
        const { email, password, name, phoneNumber } = req.body as User;

        if (!email || !password || !name || !phoneNumber) {
            res.status(400).send(
                'name, email, password and phoneNumber are required'
            );
            return;
        }

        const { error, jwt } = await AuthService.register({
            email,
            password,
            name,
            phoneNumber,
        });

        if (error && !jwt) {
            res.status(error.code).send(error.message);
        }

        res.status(200).send({ jwt });
    }
}
