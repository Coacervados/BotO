import { WhatsappClientService } from '../services';
import { UserRequestData } from './UserRequestData';

export declare global {
    namespace Express {
        interface Locals {
            clients: {
                whatsapp: WhatsappClientService;
            };
            user: UserRequestData;
        }
    }
}
