import { LottoController } from "./Lotto/LottoController";
import Telegram from "./telegram/Telegram";

const userId = process.env.USER_ID;
const userPw = process.env.USER_PW;
const token = process.env.TOKEN || "";
const chatId = process.env.CHAT_ID || "";

const main = async (): Promise<void> => {
	const telegram = new Telegram(token, chatId);
	const lotto = new LottoController(userId, userPw);
	const loginResult = await lotto.login();
	if (loginResult.response) {
		const buyResult = await lotto.buy();
		await telegram.sendMessage((buyResult.error || buyResult.response) ?? "error");
	} else {
		await telegram.sendMessage(loginResult.error ?? "error");
	}
};

main();
