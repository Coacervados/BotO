import { Server } from 'damex';
import cors from 'cors';
import 'dotenv/config';
import {
    AuthController,
    UsersController,
    CheckClientController,
    EnableClientController,
    MessagesController,
} from './controllers';

const app = new Server([
    UsersController,
    AuthController,
    CheckClientController,
    EnableClientController,
    MessagesController,
]);

app.use(cors());
app.start();
