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
}
