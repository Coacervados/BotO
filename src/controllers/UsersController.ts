import { Request, Response } from 'express';
import { Controller, Delete, Get, Patch } from 'damex';
import { UsersService } from '../services';
import { User } from '@prisma/client';

@Controller('/users')
export class UsersController {
    @Get()
    async getAll(req: Request, res: Response) {
        const users = await UsersService.all();

        res.status(200).send(users);
    }

    @Get('/:id')
    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        const user = await UsersService.findById(id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.status(200).send(user);
    }

    @Delete('/:id')
    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        const user = await UsersService.findById(id);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        await UsersService.delete(id);

        res.status(201).send('Deleted user');
    }

    @Patch('/:id')
    async updateUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const dataToChange = req.body as Partial<User>;

        const users = await UsersService.findById(id);

        if (!users) {
            res.status(404).send('User not found');
            return;
        }

        const updatedUser = await UsersService.update({
            id,
            ...dataToChange,
        });

        res.status(200).send(updatedUser);
    }
}
