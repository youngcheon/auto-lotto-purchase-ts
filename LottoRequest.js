const Lotto645GameType = {
	AUTO: 0,
	MANUAL: 1,
	SEMIAUTO: 2,
};

export class LottoRequest {
	MAX_NUMBER_COUNT_IN_GAME = 6;
	MAX_GAME_COUNT = 5;

	constructor(games) {
		this.games = games;
	}

	encodeGame(slot) {
		return {
			genType: "0",
			arrGameChoiceNum: null,
			alpabet: slot,
		};
	}

	format() {
		return `[Lotto645 Buy Request]\n${this.games?.map((game, i) => `Game ${String.fromCharCode(65 + i)}: ${game}`).join("\n")}`;
	}

	createDhlotteryRequestParam() {
		const params = [];

		for (let i = 0; i < this.games.length; i++) {
			const slot = String.fromCharCode(65 + i);
			const game = this.games[i];
			params.push(this.encodeGame(slot, game.sort()));
		}
		const ret = JSON.stringify(params);
		console.log(ret);

		return ret;
	}
}
