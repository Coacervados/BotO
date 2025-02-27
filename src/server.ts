import { Server } from 'damex';
import cors from 'cors';
import 'dotenv/config';

const app = new Server([]);

app.use(cors());

app.start();
