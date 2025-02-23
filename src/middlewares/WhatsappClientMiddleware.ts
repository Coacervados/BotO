import { NextFunction, Request, Response } from 'express';
import { WhatsappService } from '../services';

export class WhatsappClientMiddleware {
    static async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { session, phoneNumber } = req.body as Record<string, string>;

            if (!session || !phoneNumber) {
                res.status(400).send('Session and Phone Number are required.');
            }

            if (!req.client.whatsapp) {
                req.client.whatsapp = await WhatsappService.create(
                    session,
                    phoneNumber
                );
            }

            next();
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}
