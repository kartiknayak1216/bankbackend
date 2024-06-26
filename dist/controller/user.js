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
        const { clerkId, email, name } = req.body;
        if (!email || !clerkId) {
            return res.status(400).send("All credentials are required");
        }
        const user = yield prisma_1.default.user.findUnique({
            where: {
                clerkId: clerkId,
            },
        });
        if (!user) {
            // Hash the password
            const hashedPassword = yield bcryptjs_1.default.hash(email, 10);
            yield prisma_1.default.user.create({
                data: {
                    clerkId: clerkId,
                    email: email,
                    name: name || email,
                    password: hashedPassword, // use the hashed password
                },
            });
            return res.status(200).send("User created successfully");
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});
exports.deposit = deposit;
const userRoute = (0, express_1.Router)();
userRoute.post("/user", exports.deposit); // corrected route name
exports.default = userRoute;
