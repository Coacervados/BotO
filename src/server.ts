import { Server } from 'damex';
import cors from 'cors';
import 'dotenv/config';
import { AuthController, UsersController } from './controllers';

const app = new Server([UsersController, AuthController]);

app.use(cors());
app.start();
