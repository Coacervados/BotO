import { AllUnreadMessages, UnreadMessage } from '../types';
import { UsersService } from './UsersService';
import { WhatsappClientService } from './WhatsappClientService';

export class MessageService {
    private whatsappClient: WhatsappClientService;

    constructor(whatsappClient: WhatsappClientService) {
        this.whatsappClient = whatsappClient;
    }

    async getUnreadMessages(userId: number) {
        const user = await UsersService.findById(userId);
        const allUnreadMessages = {} as AllUnreadMessages;

        if (!user) {
            return { error: 'User not found', code: 404 };
        }

        if (user.hasWhatsapp) {
            allUnreadMessages.whatsapp =
                await this.whatsappClient.getUnreadMessages();
        }

        if (user.hasTelegram) {
            // add telegram
        }

        if (user.hasInstagram) {
            // add instagram messenger
        }

        return allUnreadMessages;
    }
}
