import { NextFunction, Request, Response } from 'express';
import { UsersService, WhatsappClientService } from '../services';

export async function WhatsappClientMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = await UsersService.findById(req.user.id);

        if (!user) {
            res.status(404).send('User not found');
        }

        if (!user?.hasWhatsapp) {
            next();
            return;
        }

        const session = user?.id + '_session';

        req.client.whatsapp = await WhatsappClientService.create(
            session,
            user?.phoneNumber
        );

        next();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}
