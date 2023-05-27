import axios from "axios";
import cheerio from "cheerio";

export class LottoClient {
	constructor() {
		this._defaultSessionUrl = "https://dhlottery.co.kr/gameResult.do?method=byWin&wiselog=H_C_1_1";
		this._systemUnderCheckUrl = "https://dhlottery.co.kr/index_check.html";
		this._mainUrl = "https://dhlottery.co.kr/common.do?method=main";
		this._loginRequestUrl = "https://www.dhlottery.co.kr/userSsl.do?method=login";
		this._buyLotto645Url = "https://ol.dhlottery.co.kr/olotto/game/execBuy.do";
		this._roundInfoUrl = "https://www.dhlottery.co.kr/common.do?method=main";

		this._headers = {
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
		};

		this._setDefaultSession();
	}

	async _setDefaultSession() {
		const response = await axios.get(this._defaultSessionUrl, { timeout: 10000 });
		const cookies = response.headers["set-cookie"];
		let jSessionId = "";

		if (response.request.res.responseUrl === this._systemUnderCheckUrl) {
			throw new Error("동행복권 사이트가 현재 시스템 점검중입니다.");
		}

		for (const cookie of cookies) {
			const [name, value] = cookie.split(";")[0].split("=");
			if (name === "JSESSIONID") {
				jSessionId = value;
				break;
			}
		}

		if (!jSessionId) {
			throw new Error("JSESSIONID 쿠키가 정상적으로 세팅되지 않았습니다.");
		}

		this._headers.Cookie = `JSESSIONID=${jSessionId}`;
	}

	async login(userId, userPw) {
		const response = await axios.post(
			this._loginRequestUrl,
			{
				returnUrl: this._mainUrl,
				userId,
				password: userPw,
				checkSave: "off",
				newsEventYn: "",
			},
			{
				headers: this._headers,
				timeout: 10000,
			}
		);

		const $ = cheerio.load(response.data);
		const btnCommon = $("a.btn_common");

		if (btnCommon.length > 0) {
			throw new Error("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
		}

		return "ok";
	}

	async _getRound() {
		const response = await axios.get(this._roundInfoUrl, { timeout: 10000 });
		const $ = cheerio.load(response.data);
		const lastDrawnRound = parseInt($("strong#lottoDrwNo").text(), 10);
		return lastDrawnRound + 1;
	}

	async buyLotto645(req) {
		const round = await this._getRound();

		const response = await axios.post(
			this._buyLotto645Url,
			{
				round: round.toString(),
				direct: "172.17.20.52",
				nBuyAmount: (1000 * req.getGameCount()).toString(),
				param: req.c(),
				gameCnt: req.getGameCount(),
			},
			{
				headers: this._headers,
				timeout: 10000,
			}
		);

		return JSON.parse(response.data);
	}
}
