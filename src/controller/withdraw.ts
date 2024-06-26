import express,{Router} from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";


export const withdraw = async (req: express.Request, res: express.Response) => {
  try {
    const { amount, clerkId, password } = req.body;

    if (!amount || !clerkId || !password) {
      return res.status(400).send({message:"All credentials are required"});
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!user) {
      return res.status(400).send({message:"Invalid Credentials"});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({message:"Invalid password"});
    }

    if (user.balance < amount) {
      return res.status(400).send({message:"Insufficient balance"});
    }

    const newBalance = user.balance - amount;

    await prisma.user.update({
      where: {
        clerkId: user.clerkId,
      },
      data: {
        balance: newBalance,
      },
    });

    await prisma.transaction.create({
      data: {
        amount: amount,
        type: "WITHDRAW",
        clerkId: user.clerkId,
      },
    });

    return res.status(200).send("Amount withdrawn successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send({message:"Server error"});
  }
};
const withdrawroute = Router();
withdrawroute.post("/withdraw",withdraw)
export default withdrawroute
