import { Server } from '../packages';
import { WhatsappController } from './controllers';

import cors from 'cors';
import 'dotenv/config';

const app = new Server([WhatsappController]);

app.use(cors());

app.start();
