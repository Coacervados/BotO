import { Controller, GlobalMiddleware, Post } from 'damex';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { WhatsappUsersService } from '../services';

@Controller('/enable-client')
@GlobalMiddleware([AuthMiddleware])
export class EnableClientController {
    @Post('/whatsapp')
    async enableWhatsapp(req: Request, res: Response) {
        const { phoneNumber } = req.body as { phoneNumber: string };
        const { id, email } = req.user;

        if (!phoneNumber) {
            res.status(400).send('phoneNumber is required');
            return;
        }

        const { error } = await WhatsappUsersService.enableWhatsapp({
            id,
            email,
            phoneNumber,
        });

        if (error) {
            res.status(error.code).send(error.message);
            return;
        }

        res.status(202).send('User whatsapp service enable');
    }
}
