export enum URL {
	DIRECT = "172.17.20.52",
	SESSION = "https://dhlottery.co.kr/gameResult.do?method=byWin&wiselog=H_C_1_1",
	BUY = "https://ol.dhlottery.co.kr/olotto/game/execBuy.do",
	ROUND_INFO = "https://www.dhlottery.co.kr/common.do?method=main",
	SYSTEM_CHECK = "https://dhlottery.co.kr/index_check.html",
	MAIN = "https://dhlottery.co.kr/common.do?method=main",
	LOGIN_REQUEST = "https://www.dhlottery.co.kr/userSsl.do?method=login",
}

export enum ERROR {
	maintenance = "동행복권 사이트가 현재 시스템 점검중입니다.",
	cookieNotFound = "쿠키가 정상적으로 세팅되지 않았습니다.",
	undefinedUser = "아이디와 비밀번호가 undefined입니다.",
	loginFailed = "로그인에 실패했습니다.",
	buyFailed = "구매에 실패했습니다.",
	emptyResult = "result message is empty",
}
