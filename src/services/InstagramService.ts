import { IgApiClient } from 'instagram-private-api';
import { dotenv } from 'dotenv';

dotenv.config();

export class InstagramService {
	private ig = IgAPiClient;
	
	constructor(){
		this.ig = new IgApiClient();
		this.ig.state.ganerateDevice(process.env.IG_USERNAME);
	}

	async login() {
		await this.ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);
	}

	async inbox() {
	
	}
}



