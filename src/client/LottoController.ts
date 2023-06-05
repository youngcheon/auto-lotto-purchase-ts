import { TResponse } from "../plugin/type";
import LottoService from "./LottoService";

export class LottoController {
	userId?: string;
	userPw?: string;
	constructor(userId?: string, userPw?: string) {
		this.userId = userId;
		this.userPw = userPw;
		console.log(this.userId);
	}

	async login(): Promise<TResponse> {
		return await LottoService.requestLogin(this.userId, this.userPw);
	}

	async buy(): Promise<TResponse> {
		return await LottoService.buy();
	}
}
