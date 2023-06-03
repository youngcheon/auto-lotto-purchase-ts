import { LottoController } from "./client/LottoController";
const userId = process.env.USER_ID ;
const userPw = process.env.USER_PW ;

(async () => {
	const lotto = new LottoController(userId, userPw);
	const loginResult = await lotto.login();
	console.log(loginResult);
	const buyResult = await lotto.buy();
	console.log(buyResult);
})();
