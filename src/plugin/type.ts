export type TResponse = {
	response: string | null;
	error: string | null;
};

export type TBuyResult = {
	buyRound: string;
	barCode1: string;
	barCode2: string;
	barCode3: string;
	barCode4: string;
	barCode5: string;
	barCode6: string;
	nBuyAmount: string;
	arrGameChoiceNum: string[];
	resultMsg: string;
};
