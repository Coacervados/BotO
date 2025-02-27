import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export class GeminiService {
    private model: any;

    constructor() {
        const ia = new GoogleGenerativeAI(process.env.GEMINI_KEY!);
        this.model = ia.getGenerativeModel({
            model: 'gemini-2.0-flash-thinking-exp-01-21',
        });
    }

    async chat(userId: number, custumerId: number, message: string): Promise<string> {
	
	const history = await prisma.chat.findFirst({
		where: {userId, customerId},
		include: {sender: true}
	});

        const context = history ? `${history.sender.name}: ${message}`:`User: ${message}`; 
        const result = await this.model.generativeContext(context);
        return result.response.text();
    }
}

export default new GeminiService();
