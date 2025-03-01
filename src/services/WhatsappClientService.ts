import { Whatsapp, create } from '@wppconnect-team/wppconnect';

export class WhatsappClientService {
    private client: Whatsapp;

    private constructor(client: Whatsapp) {
        this.client = client;
    }

    async connect() {
        return await this.client?.getQrCode();
    }

    public static async create(session?: string, phoneNumber?: string) {
        try {
            const client = await create({ session, phoneNumber });

            return new WhatsappClientService(client);
        } catch (error) {
            throw new Error(
                `Error initializing client with session "${session}": ${error}`
            );
        }
    }

    async sendText(to: string, message: string) {
        const { chatId, id } = await this.client.sendText(to, message, {});
        return { chatId, messageId: id };
    }

    async sendImage(to: string, imgPath: string) {
        const { id } = await this.client.sendImage(to, imgPath);
        return { messageId: id };
    }

    async sendFile(to: string, filePath: string) {
        await this.client.sendFile(to, filePath);
    }

    async deleteMessage(chatId: string, messageId: string) {
        return { status: await this.client.deleteMessage(chatId, messageId) };
    }

    async editMessage(messageId: string, newMessage: string) {
        const { chatId, id } = await this.client.editMessage(
            messageId,
            newMessage
        );
        return { chatId, messageId: id };
    }

    async getChatMessages(chatId: string) {
        const messages = await this.client.getMessages(chatId);

        return messages.map((message) => ({
            id: message.id,
            content: message.content,
            isMedia: message.isMedia,
        }));
    }
}
