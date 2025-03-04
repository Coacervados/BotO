import { Controller, Middleware, Get } from 'damex';
import { Request, Response } from 'express';
import { UsersService } from '../services';
import { AllUnreadMessages } from '../types';
import { AuthMiddleware, WhatsappClientMiddleware } from '../middlewares';

@Controller('/messages')
export class MessagesController {
    @Get('/unread')
    @Middleware([AuthMiddleware, WhatsappClientMiddleware])
    async getUnreadMessages(req: Request, res: Response) {
        const { whatsapp: whatsappClient } = res.locals.clients;
        const user = await UsersService.findById(res.locals.user.id);

        const allUnreadMessages = {} as AllUnreadMessages;

        if (user?.hasWhatsapp) {
            const unreadMessages = await whatsappClient.getUnreadMessages();
            allUnreadMessages.whatsapp = unreadMessages;
        }

        if (user?.hasInstagram) {
            // add instagram logic
        }

        if (user?.hasTelegram) {
            // add telegram logic
        }

        res.status(200).send({ unreadMessages: allUnreadMessages });
    }
}
