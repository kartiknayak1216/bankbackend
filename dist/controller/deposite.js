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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deposit = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, clerkId, password } = req.body;
        if (!amount || !clerkId || !password) {
            return res.status(400).send("All credentials are required");
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                clerkId: clerkId,
            },
        });
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: "Invalid password" });
        }
        const newBalance = user.balance + amount;
        yield prisma_1.default.user.update({
            where: {
                clerkId: user.clerkId,
            },
            data: {
                balance: newBalance,
            },
        });
        yield prisma_1.default.transaction.create({
            data: {
                amount: amount,
                type: "DEPOSIT",
                clerkId: user.clerkId
            }
        });
        return res.status(200).send("Amount deposited successfully");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" });
    }
});
exports.deposit = deposit;
const depositeroute = (0, express_1.Router)();
depositeroute.post("/deposite", exports.deposit);
exports.default = depositeroute;
