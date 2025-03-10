import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '../libs';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
    private model: any;

    constructor() {
        const ia = new GoogleGenerativeAI(process.env.GEMINI_KEY!);
        this.model = ia.getGenerativeModel({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
        });
    }

    async chat(userId: number, customerId: number, message: string): Promise<string> {
	
	const history = await prisma.chat.findFirst({
		where: {userId, customerId},
		include: {sender: true}
	});

        const context = history ? `${history.sender.name}: ${message}`:`User: ${message}`; 
        const result = await this.model.generativeContext(context);

	await prisma.chat.upsert({
		where: {customerId},
		update: {},
		create: {
			userId,
			customerId,
			//não entendi direito a ideia do omnichannel no código
			//haverá mudanças
			omnichannelId: 1
		}
	});

	return result.response.text();
    }
}

export default new GeminiService();
