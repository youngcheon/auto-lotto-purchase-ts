"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DhApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
class DhApiClient {
    constructor() {
        this._direct = "172.17.20.52";
        this._defaultSessionResource = "https://dhlottery.co.kr/gameResult.do?method=byWin&wiselog=H_C_1_1";
        this._buyLotto645Url = "https://ol.dhlottery.co.kr/olotto/game/execBuy.do";
        this._roundInfoResource = "https://www.dhlottery.co.kr/common.do?method=main";
        this._systemCheckUrl = "https://dhlottery.co.kr/index_check.html";
        this._mainUrl = "https://dhlottery.co.kr/common.do?method=main";
        this._loginRequestResource = "https://www.dhlottery.co.kr/userSsl.do?method=login";
        this.axiosInstance = axios_1.default.create({
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
    setCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(this._defaultSessionResource);
            const cookies = response.headers["set-cookie"];
            const sessionId = cookies === null || cookies === void 0 ? void 0 : cookies.map((c) => c.split(";")[0])[1].trim();
            if (response.request.res.responseUrl === this._systemCheckUrl) {
                return { response: null, error: "동행복권 사이트가 현재 시스템 점검중입니다." };
            }
            if (sessionId === null || sessionId === void 0 ? void 0 : sessionId.includes("JSESSIONID")) {
                this.axiosInstance.defaults.headers.common["Cookie"] = sessionId;
                return { response: "success", error: null };
            }
            else {
                return { response: null, error: "쿠키가 정상적으로 세팅되지 않았습니다." };
            }
        });
    }
    requestLogin(userId, userPw) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.setCookie();
            if (result.error) {
                throw new Error(result.error);
            }
            const response = yield this.axiosInstance.post(this._loginRequestResource, {
                returnUrl: this._mainUrl,
                userId,
                password: userPw,
                checkSave: "on",
                newsEventYn: "",
            });
            const $ = cheerio_1.default.load(response.data);
            const isSuccess = $("a.btn_common").length == 0;
            if (isSuccess) {
                return { response: "로그인에 성공했습니다.", error: null };
            }
            return { response: null, error: "로그인에 실패했습니다." };
        });
    }
    getRound() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.axiosInstance.get(this._roundInfoResource);
            const $ = cheerio_1.default.load(response.data);
            const lastRound = parseInt($("strong#lottoDrwNo").text(), 10);
            return String(lastRound + 1);
        });
    }
    buy() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const round = yield this.getRound();
            const body = {
                round,
                direct: this._direct,
                nBuyAmount: "1000",
                param: JSON.stringify([{ genType: "0", arrGameChoiceNum: null, alpabet: "A" }]),
                gameCnt: "1",
            };
            const response = yield this.axiosInstance.post(this._buyLotto645Url, body);
            const result = (_a = response.data) === null || _a === void 0 ? void 0 : _a.result;
            if (((_b = result === null || result === void 0 ? void 0 : result.resultMsg) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== "SUCCESS") {
                return { response: null, error: `구매에 실패했습니다: ${(result === null || result === void 0 ? void 0 : result.resultMsg) || "result message is empty"}` };
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
        });
    }
    formatLottoNumbers(result) {
        return result.arrGameChoiceNum.map((line) => `\t\t${line.slice(0, -1)}`).join("\n");
    }
}
exports.DhApiClient = DhApiClient;
exports.default = new DhApiClient();
