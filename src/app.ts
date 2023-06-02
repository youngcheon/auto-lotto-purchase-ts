import { LottoClient } from "./client/LottoClient";

(async () => {
	const userId = process.env.USER_ID;
	const userPw = process.env.USER_PW;
	const client = new LottoClient();
	try {
		await client.login(userId, userPw);
		const result = await client.buyLotto645();
		client.showResult(result);
	} catch (e) {
		console.log(e);
	}
})();
