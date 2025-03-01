import { prisma } from '../libs';

export class OmnichannelService {
    static create(userId: number) {
        return prisma.omniChannel.create({
            data: { userId },
        });
    }
}
