import { Controller, GlobalMiddleware, Post } from 'damex';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { WhatsappUsersService } from '../services';

@Controller('/enable-client')
@GlobalMiddleware([AuthMiddleware])
export class EnableClientController {
    @Post('/whatsapp')
    async enableWhatsapp(req: Request, res: Response) {
        const { id, email, phoneNumber } = req.user;

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
