import { Controller, Middleware, Post } from 'damex';
import { Request, Response } from 'express';
import { AuthMiddleware, WhatsappClientMiddleware } from '../middlewares';

@Controller('/check')
export class CheckClientController {
    @Post('/whatsapp')
    @Middleware([AuthMiddleware, WhatsappClientMiddleware])
    async checkWhatsappConnection(req: Request, res: Response) {
        if (res.locals.client.whatsapp) {
            res.status(200).send('User is connected');
            return;
        }

        res.status(404).send("User's client whatsapp connection not found");
    }
}
