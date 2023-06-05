import { LottoController } from "./Lotto/LottoController";
const userId = process.env.USER_ID;
const userPw = process.env.USER_PW;

const main = async (): Promise<void> => {
	const lotto = new LottoController(userId, userPw);
	const loginResult = await lotto.login();
	if (loginResult.response) {
		const buyResult = await lotto.buy();
		console.log(buyResult.response || buyResult.error);
	} else {
		console.log(loginResult.error);
	}
};

main();
