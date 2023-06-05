"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LottoController_1 = require("./client/LottoController");
const userId = process.env.USER_ID || "kimyoungcheon";
const userPw = process.env.USER_PW || "Rladudcjs1212!";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const lotto = new LottoController_1.LottoController(userId, userPw);
    const loginResult = yield lotto.login();
    console.log(loginResult);
    const buyResult = yield lotto.buy();
    console.log(buyResult);
}))();
