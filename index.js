import Dotenv from "dotenv";
import Lotto645Controller from "./LottoController.js";
import { LottoRequest } from "./LottoRequest.js";
import { LottoClient } from "./LottoClient.js";

Dotenv.config();
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
