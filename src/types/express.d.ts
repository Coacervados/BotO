import { WhatsappClientService } from '../services';

export declare global {
    namespace Express {
        interface Request {
            client: {
                whatsapp: WhatsappClientService;
            };
        }
    }
}
