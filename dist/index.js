"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const deposite_1 = __importDefault(require("./controller/deposite"));
const user_1 = __importDefault(require("./controller/user"));
const transfer_1 = __importDefault(require("./controller/transfer"));
const withdraw_1 = __importDefault(require("./controller/withdraw"));
const transaction_1 = __importDefault(require("./controller/transaction"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use("/api", deposite_1.default);
app.use("/api", user_1.default);
app.use("/api", withdraw_1.default);
app.use("/api", transfer_1.default);
app.use("/api", transaction_1.default);
const port = process.env.PORT;
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
