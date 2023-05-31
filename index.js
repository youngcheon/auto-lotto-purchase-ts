import Dotenv from "dotenv";
import Lotto645Controller from "./LottoController.js";
import { LottoRequest } from "./LottoRequest.js";

Dotenv.config();
const userId = process.env.USER_ID;
const userPw = process.env.USER_PW;
const control = new Lotto645Controller(userId, userPw);
await control.buy();
