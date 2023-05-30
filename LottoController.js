import { LottoClient } from "./LottoClient.js";

export default class Lotto645Controller {
	constructor(user_id, user_pw) {
		this.client = new LottoClient();
		this.client.login(user_id, user_pw);
	}

	buy(req) {
		if (!this.confirmPurchase(req, quiet)) {
			console.log("✅ 구매를 취소했습니다.");
		} else {
			const result = this.client.buy_lotto645(req);
			this.showResult(result);
		}
	}

	confirmPurchase(req) {
		console.log(`${req.format()}\n❓ 위와 같이 구매합니다`);
		return true;
	}

	showResult(body) {
		const result = body.result || {};
		if ((result.resultMsg || "FAILURE").toUpperCase() !== "SUCCESS") {
			logger.debug(`d: ${body}`);
			throw new Error(`구매에 실패했습니다: ${result.resultMsg || "resultMsg is empty"}`);
		}

		logger.debug(`response body: ${body}`);

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
