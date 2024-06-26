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
exports.transfer = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, clerkId, password, senderId, senderEmail } = req.body;
        if (!amount || !clerkId || !password) {
            return res.status(400).send({ message: "All credentials are required" });
        }
        if (!(senderId || senderEmail)) {
            return res.status(400).send({ message: "Sender credentials are required" });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                clerkId: clerkId,
            },
        });
        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
        let senderUser = null;
        if (senderId) {
            senderUser = yield prisma_1.default.user.findUnique({
                where: {
                    clerkId: senderId,
                },
            });
        }
        else if (senderEmail) {
            senderUser = yield prisma_1.default.user.findUnique({
                where: {
                    email: senderEmail,
                },
            });
        }
        if (!senderUser) {
            return res.status(400).send({ message: "Invalid Sender Credentials" });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: "Invalid password" });
        }
        if (user.balance < amount) {
            return res.status(400).send({ message: "Insufficient balance" });
        }
        const newBalance = user.balance - amount;
        const senderNewBalance = senderUser.balance + amount;
        yield prisma_1.default.user.update({
            where: {
                clerkId: user.clerkId,
            },
            data: {
                balance: newBalance,
            },
        });
        yield prisma_1.default.user.update({
            where: {
                clerkId: senderUser.clerkId,
            },
            data: {
                balance: senderNewBalance,
            },
        });
        yield prisma_1.default.transaction.create({
            data: {
                amount: amount,
                type: "TRANSFER",
                clerkId: user.clerkId,
                user: senderUser.name
            },
        });
        yield prisma_1.default.transaction.create({
            data: {
                amount: amount,
                type: "RECEIVED",
                clerkId: senderUser.clerkId,
                user: user.name
            },
        });
        return res.status(200).send("Amount transferred successfully");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" });
    }
});
exports.transfer = transfer;
const transferroute = (0, express_1.Router)();
transferroute.post("/transfer", exports.transfer);
exports.default = transferroute;
