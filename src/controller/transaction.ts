import express, { Router } from "express";
import { User } from "@prisma/client";
import prisma from "../lib/prisma";

export const transfer = async (req: express.Request, res: express.Response) => {
  try {
    const { clerkId } = req.query;

    if (!clerkId) {
      return res.status(400).send({ message: "clerkId is required" });
    }

    const userWithTransactions = await prisma.user.findUnique({
      where: {
        clerkId: clerkId as string,
      },
      include: {
        transactions: true,
      },
    });

    if (!userWithTransactions) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({ transactions: userWithTransactions });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

const transactionRoute = Router();
transactionRoute.get("/transaction", transfer);
export default transactionRoute;
