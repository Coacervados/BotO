import { GoogleGenerativeAI } from '@google/generative-ai';
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

    async chat(history: string[]): Promise<string> {
        const context = history.join();
        const result = await this.model.generativeContext(context);
        return result.response.text();
    }
}

export default new GeminiService();
