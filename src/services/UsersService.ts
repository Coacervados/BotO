import { User } from '@prisma/client';
import { prisma } from '../libs';

export class UsersService {
    all() {
        return prisma.user.findMany();
    }

    findById(id: number) {
        return prisma.user.findFirst({
            where: { id },
        });
    }

    findByEmail(email: string) {
        return prisma.user.findFirst({
            where: { email },
        });
    }

    findByPhoneNumber(phoneNumber: string) {
        return prisma.user.findFirst({
            where: { phoneNumber },
        });
    }

    create({
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

    update({ id, email, name, phoneNumber }: Partial<User>) {
        return prisma.user.update({
            where: { id },
            data: { email, name, phoneNumber },
        });
    }
}
