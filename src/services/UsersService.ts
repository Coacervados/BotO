import { prisma } from '../libs';

export class UsersService {
    async all() {
        return await prisma.user.findMany();
    }

    async findById(id: number) {
        return await prisma.user.findFirst({
            where: { id },
        });
    }

    async findByEmail(email: string) {
        return await prisma.user.findFirst({
            where: { email },
        });
    }

    async findByPhoneNumber(phoneNumber: string) {
        return await prisma.user.findFirst({
            where: { phoneNumber },
        });
    }
}
