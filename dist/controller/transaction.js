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
const prisma_1 = __importDefault(require("../lib/prisma"));
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clerkId } = req.query;
        if (!clerkId) {
            return res.status(400).send({ message: "clerkId is required" });
        }
        const userWithTransactions = yield prisma_1.default.user.findUnique({
            where: {
                clerkId: clerkId,
            },
            include: {
                transactions: true,
            },
        });
        if (!userWithTransactions) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send({ transactions: userWithTransactions });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error" });
    }
});
exports.transfer = transfer;
const transactionRoute = (0, express_1.Router)();
transactionRoute.get("/transaction", exports.transfer);
exports.default = transactionRoute;
