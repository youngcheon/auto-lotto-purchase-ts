import axios, { AxiosInstance } from "axios";
import { TBuyResult, TResponse } from "../plugin/type";
import cheerio from "cheerio";
import { ERROR, URL } from "../plugin/enum";
import { HEADERS } from "../plugin/constant";

export class LottoService {
	axiosInstance: AxiosInstance;
	constructor() {
		this.axiosInstance = axios.create({
			timeout: 10000,
			headers: HEADERS,
		});
	}

	async setCookie(): Promise<TResponse> {
		const response = await this.axiosInstance.get(URL.SESSION);
		const cookies = response.headers["set-cookie"];
		const sessionId = cookies?.map((c) => c.split(";")[0])[1].trim();

		if (response.request.res.responseUrl === URL.SYSTEM_CHECK) {
			return { response: null, error: ERROR.maintenance };
		}

		if (sessionId?.includes("JSESSIONID")) {
			this.axiosInstance.defaults.headers.common["Cookie"] = sessionId;
			return { response: "success", error: null };
		} else {
			return { response: null, error: ERROR.cookieNotFound };
		}
	}

	async requestLogin(userId?: string, userPw?: string): Promise<TResponse> {
		if (userId === undefined || userPw === undefined) {
			throw new Error(ERROR.undefinedUser);
		}
		const result = await this.setCookie();
		if (result.error) {
			throw new Error(result.error);
		}
		const response = await this.axiosInstance.post(URL.LOGIN_REQUEST, {
			returnUrl: URL.MAIN,
			userId,
			password: userPw,
			checkSave: "on",
			newsEventYn: "",
		});

		const $ = cheerio.load(response.data);
		const isSuccess = $("a.btn_common").length == 0;

		if (isSuccess) {
			return { response: "로그인에 성공했습니다.", error: null };
		}

		return { response: null, error: ERROR.loginFailed };
	}

	async getRound(): Promise<string> {
		const response = await this.axiosInstance.get(URL.ROUND_INFO);
		const $ = cheerio.load(response.data);
		const lastRound = parseInt($("strong#lottoDrwNo").text(), 10);
		return String(lastRound + 1);
	}

	async buy(): Promise<TResponse> {
		const round = await this.getRound();
		const body = {
			round,
			direct: URL.DIRECT,
			nBuyAmount: "1000",
			param: JSON.stringify([{ genType: "0", arrGameChoiceNum: null, alpabet: "A" }]),
			gameCnt: "1",
		};
		const response = await this.axiosInstance.post(URL.BUY, body);
		const result: TBuyResult = response.data?.result;
		if (result?.resultMsg?.toUpperCase() !== "SUCCESS") {
			return { response: null, error: `${ERROR.buyFailed}\n${result?.resultMsg || ERROR.emptyResult}` };
		}

		return {
			response: `✅ 구매를 완료하였습니다.
			[Lotto645 Buy Response]
			------------------
			Round:\t\t${result.buyRound}
			Barcode:\t${result.barCode1} ${result.barCode2} ${result.barCode3} ${result.barCode4} ${result.barCode5} ${result.barCode6}
			Cost:\t\t${result.nBuyAmount}
			Numbers:\n${this.formatLottoNumbers(result)}
			Message:\t${result.resultMsg}
			----------------------`,
			error: null,
		};
	}

	formatLottoNumbers(result: TBuyResult): string {
		return result.arrGameChoiceNum.map((line): string => `\t\t${line.slice(0, -1)}`).join("\n");
	}
}

export default new LottoService();
