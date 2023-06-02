import { LottoController } from "./client/LottoController";
const userId = process.env.USER_ID || "kimyougncheon97";
const userPw = process.env.USER_PW || "rladudcjs12!";

(async () => {
	const lotto = new LottoController(userId, userPw);
	const loginResult = await lotto.login();
	console.log(loginResult);
	const buyResult = await lotto.buy();
	console.log(buyResult);
})();
