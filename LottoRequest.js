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

		if (!this.isCorrectGames(games)) {
			throw new Error(`비정상적인 구매 요청입니다.\n${this.format()}`);
		}
	}

	isCorrectGames(games) {
		return Array.isArray(games) && games.length <= this.MAX_GAME_COUNT && games.every((game) => this.isCorrectGame(game));
	}

	isCorrectGame(game) {
		return Array.isArray(game) && game.length <= this.MAX_NUMBER_COUNT_IN_GAME && game.every((x) => typeof x === "number" && x >= 1 && x <= 45 && game.indexOf(x) === game.lastIndexOf(x));
	}

	hasAutoGame() {
		return this.filterUsedGames().some((game) => this.isAutoGame(game));
	}

	isAutoGame(game) {
		return this.getManualCountInGame(game) === 0;
	}

	hasSemiAutoGame() {
		return this.filterUsedGames().some((game) => this.isSemiAutoGame(game));
	}

	isSemiAutoGame(game) {
		const manualCount = this.getManualCountInGame(game);
		return manualCount > 0 && manualCount < this.MAX_NUMBER_COUNT_IN_GAME;
	}

	hasManualGame() {
		return this.filterUsedGames().some((game) => this.isManualGame(game));
	}

	isManualGame(game) {
		return this.getManualCountInGame(game) === this.MAX_NUMBER_COUNT_IN_GAME;
	}

	getAutoCountInGame(game) {
		return this.MAX_NUMBER_COUNT_IN_GAME - game.length;
	}

	getManualCountInGame(game) {
		return game.length;
	}

	getGameCount() {
		return this.filterUsedGames().length;
	}

	filterUsedGames() {
		return this.games.filter((game) => game !== null);
	}

	getGameType(game) {
		if (this.isAutoGame(game)) {
			return Lotto645GameType.AUTO;
		}
		if (this.isManualGame(game)) {
			return Lotto645GameType.MANUAL;
		}
		if (this.isSemiAutoGame(game)) {
			return Lotto645GameType.SEMIAUTO;
		}

		throw new Error("지원하지 않는 게임 타입입니다.");
	}

	getGenType(gameType) {
		if (!Object.values(Lotto645GameType).includes(gameType)) {
			throw new Error("지원하지 않는 게임 타입입니다.");
		}

		return gameType.toString();
	}

	encodeGame(slot, game) {
		const gameType = this.getGameType(game);

		return {
			genType: this.getGenType(gameType),
			arrGameChoiceNum: gameType !== Lotto645GameType.AUTO ? game.map(String).join(",") : null,
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

		return JSON.stringify(params);
	}
}
