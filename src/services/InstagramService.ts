import { DirectInboxFeed, IgApiClient } from 'instagram-private-api';
import dotenv from 'dotenv';
import { threadId } from 'worker_threads';
import GeminiService  from './GeminiService';
import { prisma } from '../libs';

dotenv.config();

export class InstagramService {
	private ig: IgApiClient;
	
	constructor(){
		this.ig = new IgApiClient();
		this.ig.state.generateDevice(process.env.IG_USERNAME!);
	}

	async login() {
		await this.ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);
	}

	async inbox() {
		const inboxMsg = this.ig.feed.directInbox();
		const threads = await inboxMsg.items();

		for(const thread of threads) {
			const threadId = thread.thread_id;

			for(const item of thread.items) {
				if(item.item_type === 'text' && String(item.user_id) !== this.ig.state.cookieUserId) {
					const senderId = item.user_id.toString();
					const text = item.text;

					console.log(`Origem da mensagem ${senderId}: ${text}`);

					await this.processMsg(senderId, text!, thread.thread_id);
				}
			}
		}
	}

	async processMsg(senderId: string, text: string, threadId: string){
		let customer = await prisma.customer.findFirst({
			where: { 
				ig: senderId
			}
		});

		// Preciso de uma lógica para achar o dono do  omnichannel correspondente
		const omnichannel = await prisma.omniChannel.findFirst();

		if (!omnichannel) {
			throw new Error("Sem omnichannell disponível");
		}

		if(!customer) {
			customer = await prisma.customer.create({
				data: {
					name: `InstagramUser_${senderId}`,
					ig: senderId,
					sendFrom: 'instagram',
					// essa parte sofrerá alterações, para aplicação de uma mais coerente
					userId: omnichannel.userId
				}
			});
		}

		const res = await GeminiService.chat(customer.userId, customer.id, text);

		await this
	}

	async sendMsg(threadId: string, msg: string) {
		const thread = this.ig.entity.directThread(threadId);
		await thread.broadcastText(msg);

		console.log(`Mensagem enviada: ${msg}`);
	}
}

export default new InstagramService();

