import { LottoController } from "./client/LottoController";
const userId = process.env.USER_ID || "kimyoungcheon";
const userPw = process.env.USER_PW || "Rladudcjs1212!";

const main = async (): Promise<void> => {
	const lotto = new LottoController(userId, userPw);

	const { response, error } = await lotto.login();
	if (error) {
		console.log(error);
		return;
	}
	const buyResult = await lotto.buy();
	console.log(JSON.stringify(buyResult));
};

main();
