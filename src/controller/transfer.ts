import express, { Router } from "express";
import {  User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";


export const transfer = async (req: express.Request, res: express.Response) => {
  try {
    const { amount, clerkId, password, senderId, senderEmail } = req.body;

    if (!amount || !clerkId || !password) {
      return res.status(400).send({message:"All credentials are required"});
    }

    if (!(senderId || senderEmail)) {
      return res.status(400).send({message:"Sender credentials are required"});
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!user) {
      return res.status(400).send({message:"Invalid Credentials"});
    }

    let senderUser:User | null=null


    

    if (senderId) {
      senderUser = await prisma.user.findUnique({
        where: {
          clerkId: senderId,
        },
      });
    } else if (senderEmail) {
      senderUser = await prisma.user.findUnique({
        where: {
          email: senderEmail,
        },
      });
    }

    if (!senderUser) {
      return res.status(400).send({message:"Invalid Sender Credentials"});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({message:"Invalid password"});
    }

    if (user.balance < amount) {
      return res.status(400).send({message:"Insufficient balance"});
    }

    const newBalance = user.balance - amount;
    const senderNewBalance = senderUser.balance + amount;

    await prisma.user.update({
      where: {
        clerkId: user.clerkId,
      },
      data: {
        balance: newBalance,
      },
    });

    await prisma.user.update({
      where: {
        clerkId: senderUser.clerkId,
      },
      data: {
        balance: senderNewBalance,
      },
    });

    await prisma.transaction.create({
      data: {
        amount: amount,
        type: "TRANSFER",
        clerkId: user.clerkId,
        user:  senderUser.name
      },
    });

    await prisma.transaction.create({
      data: {
        amount: amount,
        type: "RECEIVED",
        clerkId: senderUser.clerkId,
        user:  user.name

      },
    });

    return res.status(200).send("Amount transferred successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send({message:"Server error"});
  }
};

const transferroute = Router();
transferroute.post("/transfer",transfer)
export default transferroute