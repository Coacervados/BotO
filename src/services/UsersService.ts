import { User } from '@prisma/client';
import { prisma } from '../libs';

export class UsersService {
    static all() {
        return prisma.user.findMany();
    }

    static findById(id: number) {
        return prisma.user.findFirst({
            where: { id },
        });
    }

    static findByEmail(email: string) {
        return prisma.user.findFirst({
            where: { email },
        });
    }

    static findByPhoneNumber(phoneNumber: string) {
        return prisma.user.findFirst({
            where: { phoneNumber },
        });
    }

    static create({
        email,
        name,
        phoneNumber,
        password,
    }: Pick<User, 'email' | 'name' | 'password' | 'phoneNumber'>) {
        return prisma.user.create({
            data: {
                email,
                name,
                phoneNumber,
                password,
            },
        });
    }

    static update({ id, email, name, phoneNumber }: Partial<User>) {
        return prisma.user.update({
            where: { id },
            data: { email, name, phoneNumber },
        });
    }

    static delete(id: number) {
        return prisma.user.delete({
            where: { id },
        });
    }

    static enableWhatsapp(id: number) {
        return prisma.user.update({
            where: { id },
            data: { hasWhatsapp: true },
        });
    }

    static enableTelegram(id: number) {
        return prisma.user.update({
            where: { id },
            data: { hasInstagram: true },
        });
    }

    static enableInstagram(id: number) {
        return prisma.user.update({
            where: { id },
            data: { hasTelegram: true },
        });
    }
}
