import { IgApiClient } from 'instagram-private-api';
import { prisma } from '../libs';
import dotenv from 'dotenv';

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

	}
}



