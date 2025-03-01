import { User } from '@prisma/client';
import { UsersService } from './UsersService';

export class WhatsappUsersService {
    static async enableWhatsapp({
        id,
        email,
        phoneNumber,
    }: Pick<User, 'id' | 'phoneNumber' | 'email'>) {
        const user = await UsersService.findById(id);

        if (!user) {
            return { error: { message: 'user not found', code: 404 } };
        }

        if (user.hasWhatsapp) {
            return {
                error: {
                    message: 'user already has whatsapp service enable',
                    code: 409,
                },
            };
        }

        await UsersService.enableWhatsapp(user.id);
        return { error: undefined };
    }
}
