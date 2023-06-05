import axios from "axios";

class Telegram {
	token: string;
	chatId: string;
	constructor(token: string, chatId: string) {
		this.token = token;
		this.chatId = chatId;
	}

	async sendMessage(text: string) {
		return await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage?chat_id=${this.chatId}&text=${text}`);
	}
}

export default Telegram;
