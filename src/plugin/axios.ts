import axios, { AxiosInstance } from "axios";
import cheerio from "cheerio";

type TResponse = {
	response: string | null;
	error: string | null;
};

type TBuyResult = {
	buyRound: string;
	barCode1: string;
	barCode2: string;
	barCode3: string;
	barCode4: string;
	barCode5: string;
	barCode6: string;
	nBuyAmount: string;
	arrGameChoiceNum: string[];
	resultMsg: string;
};

export class DhApiClient {
	axiosInstance: AxiosInstance;
	_defaultSessionResource: string;
	_systemCheckUrl: string;
	_loginRequestResource: string;
	_mainUrl: string;
	_roundInfoResource: string;
	_direct: string;
	_buyLotto645Url: string;

	constructor() {
		this._direct = "172.17.20.52";
		this._defaultSessionResource = "https://dhlottery.co.kr/gameResult.do?method=byWin&wiselog=H_C_1_1";
		this._buyLotto645Url = "https://ol.dhlottery.co.kr/olotto/game/execBuy.do";
		this._roundInfoResource = "https://www.dhlottery.co.kr/common.do?method=main";
		this._systemCheckUrl = "https://dhlottery.co.kr/index_check.html";
		this._mainUrl = "https://dhlottery.co.kr/common.do?method=main";
		this._loginRequestResource = "https://www.dhlottery.co.kr/userSsl.do?method=login";
		this.axiosInstance = axios.create({
			timeout: 10000,
			headers: {
				"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
				Connection: "keep-alive",
				"Cache-Control": "max-age=0",
				"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
				"sec-ch-ua-mobile": "?0",
				"Upgrade-Insecure-Requests": "1",
				Origin: "https://dhlottery.co.kr",
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				Referer: "https://dhlottery.co.kr/",
				"Sec-Fetch-Site": "same-site",
				"Sec-Fetch-Mode": "navigate",
				"Sec-Fetch-User": "?1",
				"Sec-Fetch-Dest": "document",
				"Accept-Language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
			},
		});
	}

	async setCookie(): Promise<TResponse> {
		const response = await this.axiosInstance.get(this._defaultSessionResource);
		const cookies = response.headers["set-cookie"];
		const sessionId = cookies?.map((c) => c.split(";")[0])[1].trim();

		if (response.request.res.responseUrl === this._systemCheckUrl) {
			return { response: null, error: "동행복권 사이트가 현재 시스템 점검중입니다." };
		}

		if (sessionId?.includes("JSESSIONID")) {
			this.axiosInstance.defaults.headers.common["Cookie"] = sessionId;
			return { response: "success", error: null };
		} else {
			return { response: null, error: "쿠키가 정상적으로 세팅되지 않았습니다." };
		}
	}

	async requestLogin(userId?: string, userPw?: string): Promise<TResponse> {
		const result = await this.setCookie();
		if (result.error) {
			throw new Error(result.error);
		}
		const response = await this.axiosInstance.post(this._loginRequestResource, {
			returnUrl: this._mainUrl,
			userId,
			password: userPw,
			checkSave: "on",
			newsEventYn: "",
		});
		console.log(response.request);

		const $ = cheerio.load(response.data);
		const isSuccess = $("a.btn_common").length == 0;

		if (isSuccess) {
			return { response: "로그인에 성공했습니다.", error: null };
		}

		return { response: null, error: "로그인에 실패했습니다." };
	}

	async getRound(): Promise<string> {
		const response = await this.axiosInstance.get(this._roundInfoResource);
		const $ = cheerio.load(response.data);
		const lastRound = parseInt($("strong#lottoDrwNo").text(), 10);
		return String(lastRound + 1);
	}

	async buy(): Promise<TResponse> {
		const round = await this.getRound();
		const body = {
			round,
			direct: this._direct,
			nBuyAmount: "1000",
			param: JSON.stringify([{ genType: "0", arrGameChoiceNum: null, alpabet: "A" }]),
			gameCnt: "1",
		};
		const response = await this.axiosInstance.post(this._buyLotto645Url, body);
		const result: TBuyResult = response.data?.result;
		if (result?.resultMsg?.toUpperCase() !== "SUCCESS") {
			return { response: null, error: `구매에 실패했습니다: ${result?.resultMsg || "result message is empty"}` };
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

export default new DhApiClient();
