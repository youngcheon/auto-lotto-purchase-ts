import { LottoClient } from "./LottoClient.js";

export default class Lotto645Controller {
	constructor(user_id, user_pw) {
		this.client = new LottoClient();
		this.client.login(user_id, user_pw);
	}

	buy(req) {
		const result = this.client.buyLotto645(req);
		this.showResult(result);
	}

	showResult(body) {
		const result = body.result || {};
		if ((result.resultMsg || "FAILURE").toUpperCase() !== "SUCCESS") {
			console.warn(`d: ${body}`);
			throw new Error(`구매에 실패했습니다: ${result.resultMsg || "resultMsg is empty"}`);
		}

		console.log(
			`✅ 구매를 완료하였습니다.
  [Lotto645 Buy Response]
  ------------------
  Round:\t\t${result.buyRound}
  Barcode:\t${result.barCode1} ${result.barCode2} ${result.barCode3} ${result.barCode4} ${result.barCode5} ${result.barCode6}
  Cost:\t\t${result.nBuyAmount}
  Numbers:\n${this.formatLottoNumbers(result.arrGameChoiceNum)}
  Message:\t${result.resultMsg}
  ----------------------`
		);
	}

	formatLottoNumbers(lines) {
		const modes = {
			1: "수동",
			2: "반자동",
			3: "자동",
		};

		const tabbedLines = lines.map((line) => `\t\t${line.slice(0, -1)} (${modes[line.slice(-1)]})`);

		return tabbedLines.join("\n");
	}
}
