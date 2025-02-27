import { Request, Response } from 'express';
import { Controller, Get, Patch } from 'damex';
import { UsersService } from '../services';

@Controller('/users')
export class UsersController {
    private readonly service = new UsersService();

    @Get()
    async getAll(req: Request, res: Response) {
        const users = await this.service.all();

        res.status(200).send(users);
    }

    @Get('/:id')
    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(401).send('Invalid Id');
            return;
        }

        const users = await this.service.findById(id);

        res.status(200).send(users);
    }

    @Patch('/:id')
    async updateUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(401).send('Insert a valid Id');
            return;
        }

        const users = await this.service.findById(id);

        if (!users) {
            res.status(404).send('USer not found');
        }

        res.status(200).send(users);
    }
}
