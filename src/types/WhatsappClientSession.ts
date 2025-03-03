import { WhatsappClientService } from '../services';

export type WhatsappClientSession = {
    sessionId: string;
    client: WhatsappClientService;
};
