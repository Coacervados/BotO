import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService{
  private apiKey = new GoogleGenerativeAI(process.env.API_KEY!);

  constructor(apiKey: GoogleGenerativeAI) {
    this.apiKey = apiKey;
  }

}