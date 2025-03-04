import { NextFunction, Request, Response } from 'express';
import { UsersService, WhatsappClientService } from '../services';
import { WhatsappClientSession } from '../types';

// TODO: implement a timer to remove the client session after some minutes
const clients: WhatsappClientSession[] = [];

export async function WhatsappClientMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = await UsersService.findById(res.locals.user.id);
    res.locals.clients = {} as any;

    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    if (!user?.hasWhatsapp || !user.phoneNumber) {
        next();
        return;
    }

    const sessionId = user?.id + '_session';

    if (clientAlreadyExist(sessionId)) {
        const client = getExistentClient(sessionId)!;

        res.locals.clients.whatsapp = client;
        next();
        return;
    }

    const client = await WhatsappClientService.create(
        sessionId,
        user.phoneNumber
    );

    res.locals.clients.whatsapp = client;
    setClient(client, sessionId);

    next();
}

function clientAlreadyExist(sessionId: string) {
    return clients.some((client) => client.sessionId === sessionId);
}

function getExistentClient(sessionId: string) {
    return clients.find((client) => client.sessionId === sessionId)?.client;
}

function setClient(client: WhatsappClientService, sessionId: string) {
    clients.push({
        client,
        sessionId,
    });
}
