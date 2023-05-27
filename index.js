import { LottoClient } from "./LottoClient.js";
import Dotenv from "dotenv";
import { LottoRequest } from "./LottoRequest.js";

Dotenv.config();
const userId = process.env.USER_ID;
const userPw = process.env.USER_PW;

const client = new LottoClient();

try {
	await client.login(userId, userPw);
	const request = new LottoRequest();
	const result = client.buyLotto645(request);
	console.log(result);
} catch (err) {
	console.log(err);
}
