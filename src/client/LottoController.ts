import dhClient from "../plugin/axios";

export class LottoController {
	userId?: string;
	userPw?: string;
	constructor(userId?: string, userPw?: string) {
		this.userId = userId;
		this.userPw = userPw;
	}

	async login(): Promise<string> {
		const result = await dhClient.requestLogin(this.userId, this.userPw);
		return result.error || result.response || "error";
	}

	async buy() {
		const result = await dhClient.buy();
		return result.response || result.error || "error";
	}
}
