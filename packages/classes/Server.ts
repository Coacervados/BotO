import { ServerConfigsParams } from '../types';
import express, { type Application, type RequestHandler } from 'express';

export class Server {
    private readonly app: Application = express();

    constructor(private readonly controllers: any[]) {
        this.setupControllers();
    }

    start(port: number = 3000) {
        this.app.listen(port, () => {
            console.log(`Application running on port ${port} 🟢`);
        });
    }

    use(...handlers: RequestHandler[]) {
        this.app.use(handlers);
    }

    private setupControllers() {
        this.app.use(express.json());

        this.controllers.forEach((controller) => {
            const router = Reflect.getOwnMetadata(
                ServerConfigsParams.Router,
                controller
            );

            const globalMiddleware = Reflect.getOwnMetadata(
                ServerConfigsParams.GlobalMiddleware,
                controller
            );

            if (globalMiddleware) {
                this.app.use(router, globalMiddleware);
                return;
            }

            this.app.use(router);
        });
    }
}
